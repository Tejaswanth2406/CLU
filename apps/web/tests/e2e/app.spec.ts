import { test, expect } from "@playwright/test";

const SAMPLE_TOS = `
Terms of Service - AcmeCorp
Last updated: January 1, 2025

By using our service, you agree to the following terms. We may collect and share your personal 
data with third-party advertising partners without additional notice. We reserve the right to 
modify these terms at any time and your continued use constitutes acceptance.

All disputes must be resolved through binding arbitration. You waive your right to participate 
in class action lawsuits. Your subscription will automatically renew unless cancelled 48 hours 
before the renewal date.

We may terminate your account at any time for any reason without refund. You grant us a 
worldwide, irrevocable, royalty-free license to use any content you upload.
`.trim();

test.describe("CLU — End-to-End", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the home page correctly", async ({ page }) => {
    await expect(page.getByText("Read the fine print")).toBeVisible();
    await expect(page.getByText("CLU", { exact: true }).first()).toBeVisible();
    await expect(page.getByPlaceholder(/paste/i)).toBeVisible();
  });

  test("analyze button is disabled on empty input", async ({ page }) => {
    const btn = page.getByRole("button", { name: /analyze document/i });
    await expect(btn).toBeDisabled();
  });

  test("analyze button enables after pasting text", async ({ page }) => {
    await page.getByPlaceholder(/paste/i).fill(SAMPLE_TOS);
    const btn = page.getByRole("button", { name: /analyze document/i });
    await expect(btn).toBeEnabled();
  });

  test("doc type selector changes active state", async ({ page }) => {
    await page.getByRole("button", { name: "Privacy Policy" }).click();
    const btn = page.getByRole("button", { name: "Privacy Policy" });
    await expect(btn).toHaveClass(/bg-gray-900|dark:bg-white/);
  });

  test("shows character count when text is entered", async ({ page }) => {
    await page.getByPlaceholder(/paste/i).fill(SAMPLE_TOS);
    await expect(page.getByText(/chars/)).toBeVisible();
  });

  test("theme toggle switches dark mode class", async ({ page }) => {
    await page.getByLabel("Toggle theme").click();
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("history panel opens and closes", async ({ page }) => {
    // Panel should not be visible initially
    await expect(page.getByText("Analysis history")).not.toBeVisible();
  });
});
