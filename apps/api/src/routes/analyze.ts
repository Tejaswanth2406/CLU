import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import { createClient } from "redis";

const router = Router();

// 🧠 Redis Cache Setup
const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

// Connect to redis (async)
let redisConnected = false;
(async () => {
  try {
    await redis.connect();
    redisConnected = true;
    console.log("🧠 Connected to Redis");
  } catch (err) {
    console.warn("⚠️ Redis not available, caching disabled.");
  }
})();

const schema = z.object({
  input: z.string().min(50).max(8000),
  docType: z.string().optional(),
});

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const withTimeout = (promise: Promise<any>, ms: number) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);

// 🏎️ Standard Analyze Route (with Caching)
router.post("/", async (req, res) => {
  try {
    const { input, docType } = schema.parse(req.body);

    // 1. Check Cache
    const cacheKey = `clu:analysis:${crypto
      .createHash("sha256")
      .update(`${input}:${docType}`)
      .digest("hex")}`;

    if (redisConnected) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("⚡ Cache hit!");
        return res.json(JSON.parse(cached));
      }
    }

    // 2. Call AI with Timeout (30s)
    const response = (await withTimeout(
      fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: input }],
        }),
      }),
      30000
    )) as Response;

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const result = await response.json();

    // 3. Store in Cache (1 hour)
    if (redisConnected) {
      await redis.set(cacheKey, JSON.stringify(result), {
        EX: 3600,
      });
    }

    res.json(result);
  } catch (err: any) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    res.status(500).json({ error: "Analysis failed" });
  }
});

// ⚡ Streaming Route
router.post("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { input } = schema.parse(req.body);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 2000,
        stream: true,
        messages: [{ role: "user", content: input }],
      }),
    });

    if (!response.ok) {
       res.write(`data: ERROR ${response.status}\n\n`);
       return res.end();
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      res.write(`data: ${chunk}\n\n`);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ERROR\n\n`);
    res.end();
  }
});

export default router;
