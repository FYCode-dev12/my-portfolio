import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { projectFrontmatterSchema } from "../src/lib/schema.ts";

const PROJECTS_DIR = join(process.cwd(), "content", "projects");

const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));
const errors: string[] = [];
const slugs = new Map<string, string>();

for (const file of files) {
  const { data } = matter(readFileSync(join(PROJECTS_DIR, file), "utf8"));
  const result = projectFrontmatterSchema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${file}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    continue;
  }

  const { slug } = result.data;
  if (slug !== file.replace(/\.mdx$/, "")) {
    errors.push(`${file}: slug "${slug}" harus sama dengan nama file`);
  }
  const existing = slugs.get(slug);
  if (existing) errors.push(`${file}: slug "${slug}" duplikat dengan ${existing}`);
  slugs.set(slug, file);
}

if (errors.length > 0) {
  console.error(`Validasi konten gagal (${errors.length} masalah):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Konten valid: ${files.length} file proyek diperiksa.`);
