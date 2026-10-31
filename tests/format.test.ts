import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatAchievementPeriod,
  formatProjectPeriod,
  formatYearMonth,
} from "../src/lib/format.ts";

test("formatYearMonth memakai singkatan bulan Indonesia", () => {
  assert.equal(formatYearMonth("2025-08"), "Agu 2025");
  assert.equal(formatYearMonth("2026-12"), "Des 2026");
});

test("formatProjectPeriod: tanpa akhir berarti masih berjalan", () => {
  assert.equal(formatProjectPeriod("2026-03"), "Mar 2026 – sekarang");
  assert.equal(formatProjectPeriod("2025-11", "2025-12"), "Nov 2025 – Des 2025");
  assert.equal(formatProjectPeriod("2025-11", "2025-11"), "Nov 2025");
});

test("formatAchievementPeriod: tanpa akhir berarti satu bulan saja", () => {
  assert.equal(formatAchievementPeriod("2025-09"), "Sep 2025");
  assert.equal(formatAchievementPeriod("2025-09", "present"), "Sep 2025 – sekarang");
  assert.equal(formatAchievementPeriod("2025-09", "2025-10"), "Sep 2025 – Okt 2025");
});
