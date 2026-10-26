"use client";

import { Moon, Sun } from "lucide-react";
import { centerOf, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={(event) => toggleTheme(centerOf(event.currentTarget))}
      aria-label="Ganti tema terang atau gelap"
      className="press inline-flex size-10 items-center justify-center rounded-md bg-surface text-muted transition-colors hover:text-fg"
    >
      <Sun aria-hidden="true" className="theme-icon-dark size-5" />
      <Moon aria-hidden="true" className="theme-icon-light size-5" />
    </button>
  );
}
