import { test } from "node:test";
import assert from "node:assert/strict";
import { projectFrontmatterSchema } from "../src/lib/schema.ts";

const base = {
  title: "Contoh",
  slug: "contoh",
  summary: "Ringkasan singkat.",
  role: "Fullstack developer",
  period: { start: "2026-01" },
  status: "live",
  stack: ["Next.js"],
  links: {},
  repoVisibility: "public",
};

test("frontmatter minimal valid dan mengisi nilai bawaan", () => {
  const p = projectFrontmatterSchema.parse(base);
  assert.equal(p.featured, false);
  assert.equal(p.order, 100);
  assert.deepEqual(p.gallery, []);
  assert.deepEqual(p.metrics, []);
});

test("status demo diterima, status asing ditolak", () => {
  assert.ok(projectFrontmatterSchema.safeParse({ ...base, status: "demo" }).success);
  assert.ok(!projectFrontmatterSchema.safeParse({ ...base, status: "selesai" }).success);
});

test("periode harus YYYY-MM dengan bulan 01–12", () => {
  assert.ok(!projectFrontmatterSchema.safeParse({ ...base, period: { start: "2026-13" } }).success);
  assert.ok(!projectFrontmatterSchema.safeParse({ ...base, period: { start: "2026-1" } }).success);
});

test("ringkasan maksimal 200 karakter dan slug hanya huruf kecil, angka, tanda hubung", () => {
  assert.ok(!projectFrontmatterSchema.safeParse({ ...base, summary: "x".repeat(201) }).success);
  assert.ok(!projectFrontmatterSchema.safeParse({ ...base, slug: "Contoh_Slug" }).success);
});

test("liveLabel maksimal 30 karakter dan galeri maksimal 4 gambar", () => {
  assert.ok(
    !projectFrontmatterSchema.safeParse({ ...base, links: { liveLabel: "x".repeat(31) } }).success,
  );
  const shot = { src: "/projects/a.webp", caption: "a" };
  assert.ok(
    projectFrontmatterSchema.safeParse({ ...base, gallery: [shot, shot, shot, shot] }).success,
  );
  assert.ok(
    !projectFrontmatterSchema.safeParse({ ...base, gallery: [shot, shot, shot, shot, shot] })
      .success,
  );
});
