"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Penyimpanan diblokir (mode privat): tema tetap berlaku untuk sesi ini.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti tema terang atau gelap"
      className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-surface"
    >
      <Sun aria-hidden="true" className="theme-icon-dark size-5" />
      <Moon aria-hidden="true" className="theme-icon-light size-5" />
    </button>
  );
}
