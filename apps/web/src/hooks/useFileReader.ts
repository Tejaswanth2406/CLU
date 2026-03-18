import { useState } from "react";
import { MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface UseFileReaderResult {
  readFile: (file: File) => void;
  isReading: boolean;
  fileError: string | null;
}

export function useFileReader(onContent: (text: string) => void): UseFileReaderResult {
  const [isReading, setIsReading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const readFile = (file: File) => {
    setFileError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is 500 KB.`);
      return;
    }

    setIsReading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        onContent(text);
      }
      setIsReading(false);
    };

    reader.onerror = () => {
      setFileError("Failed to read file. Please try pasting the text directly.");
      setIsReading(false);
    };

    reader.readAsText(file);
  };

  return { readFile, isReading, fileError };
}
