import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { projectFrontmatterSchema } from "../src/lib/schema.ts";

const ROOT = process.cwd();
const PROJECTS_DIR = join(ROOT, "content", "projects");
const DATA_DIR = join(ROOT, "src", "content");
const MAX_FEATURED = 3;
const PLACEHOLDER = /TODO\(owner\)|\bTBD\b|lorem ipsum|<isi>/i;  // taste-skill-ignore

const errors: string[] = [];
const slugs = new Map<string, string>();
let featured = 0;

const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
  const raw = readFileSync(join(PROJECTS_DIR, file), "utf8");
  const { data } = matter(raw);
  const result = projectFrontmatterSchema.safeParse(data);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${file}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    continue;
  }

  const project = result.data;
  if (project.slug !== file.replace(/\.mdx$/, "")) {
    errors.push(`${file}: slug "${project.slug}" harus sama dengan nama file`);
  }
  for (const src of [project.cover, ...project.gallery.map((g) => g.src)]) {
    if (src && !existsSync(join(ROOT, "public", src))) {
      errors.push(`${file}: gambar "${src}" tidak ada di public/`);
    }
  }
  const existing = slugs.get(project.slug);
  if (existing) errors.push(`${file}: slug "${project.slug}" duplikat dengan ${existing}`);
  slugs.set(project.slug, file);

  if (!project.draft) {
    if (project.featured) featured += 1;
    const match = raw.match(PLACEHOLDER);
    if (match) {
      errors.push(
        `${file}: proyek non-draft mengandung placeholder "${match[0]}". Hapus bagiannya atau set draft: true`,
      );
    }
  }
}

if (featured > MAX_FEATURED) {
  errors.push(`terlalu banyak proyek featured non-draft: ${featured} (maksimal ${MAX_FEATURED})`);
}

for (const file of readdirSync(DATA_DIR).filter((f) => f.endsWith(".ts"))) {
  const match = readFileSync(join(DATA_DIR, file), "utf8").match(PLACEHOLDER);
  if (match)
    errors.push(
      `src/content/${file}: mengandung placeholder "${match[0]}" yang akan tampil di produksi`,
    );
}

if (errors.length > 0) {
  console.error(`Validasi konten gagal (${errors.length} masalah):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Konten valid: ${files.length} file proyek diperiksa, ${featured} featured.`);
