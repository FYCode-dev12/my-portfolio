import { existsSync } from "node:fs";
import path from "node:path";

/** Tautan CV hanya ada bila `public/cv.pdf` sudah diletakkan pemilik. Dievaluasi saat build. */
export function getCvHref(): string | undefined {
  return existsSync(path.join(process.cwd(), "public", "cv.pdf")) ? "/cv.pdf" : undefined;
}
