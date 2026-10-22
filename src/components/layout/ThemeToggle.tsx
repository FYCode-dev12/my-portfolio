"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
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
      className="inline-flex size-10 items-center justify-center rounded-md border border-border-strong text-muted transition-colors hover:border-accent hover:text-fg"
    >
      <Sun aria-hidden="true" className="theme-icon-dark size-5" />
      <Moon aria-hidden="true" className="theme-icon-light size-5" />
    </button>
  );
}
