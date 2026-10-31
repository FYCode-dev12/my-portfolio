import { existsSync } from "node:fs";
import path from "node:path";

const PROFILE_PHOTO = "/photos/febrian.webp";

/** Foto profil hanya dipakai bila `public/photos/febrian.webp` ada. Dievaluasi saat build. */
export function getProfilePhoto(): string | undefined {
  return existsSync(path.join(process.cwd(), "public", PROFILE_PHOTO)) ? PROFILE_PHOTO : undefined;
}
