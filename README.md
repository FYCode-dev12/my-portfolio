# Portofolio Febrian Yoel Anggara Saputra

Next.js (App Router) + TypeScript strict + Tailwind CSS v4. Konten studi kasus dalam MDX yang divalidasi `zod`.

Aturan proyek dan design token ada di `AGENTS.md`. Rencana dan progres ada di `docs/PLAN.md` dan `docs/PROGRESS.md`.

## Menjalankan

```bash
npm install
npm run dev
```

## Script

| Script             | Fungsi                                                                              |
| ------------------ | ----------------------------------------------------------------------------------- |
| `dev`              | Server pengembangan                                                                 |
| `build`            | Validasi konten, lalu build produksi                                                |
| `start`            | Menjalankan hasil build                                                             |
| `lint`             | ESLint                                                                              |
| `typecheck`        | `tsc --noEmit`                                                                      |
| `validate:content` | Validasi frontmatter `content/projects/*.mdx` terhadap skema di `src/lib/schema.ts` |
| `format`           | Prettier                                                                            |

## Menambah proyek

1. Buat `content/projects/<slug>.mdx`. Nama file harus sama dengan `slug`.
2. Isi frontmatter sesuai `src/lib/schema.ts`.
3. Data yang belum diketahui ditulis `TODO(owner)` dan `draft: true`.
4. Jalankan `npm run validate:content`.

## Privasi

Jangan commit `.env*`, kode repo organisasi yang private, nomor HP, atau alamat rumah.
