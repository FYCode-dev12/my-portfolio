"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { CommandContext } from "./command-data";

// Modul palette baru diunduh saat pertama kali dibuka.
const CommandMenu = dynamic(() => import("./CommandMenu").then((m) => m.CommandMenu), {
  ssr: false,
});

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

export function CommandTrigger({ context }: { context: CommandContext }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const show = useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !isTypingTarget(event.target);
      if (combo || slash) {
        event.preventDefault();
        show();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        onPointerEnter={() => setLoaded(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K /"
        className="press inline-flex h-10 items-center gap-3 rounded-md bg-surface px-3 text-sm text-muted transition-colors hover:text-fg"
      >
        {/* Di bawah `lg` labelnya hanya untuk pembaca layar agar nama dan tautan di header muat. */}
        <span className="max-lg:sr-only">Perintah</span>
        <kbd className="font-mono text-[0.8125rem] whitespace-nowrap text-fg">Ctrl K</kbd>
      </button>
      {loaded ? <CommandMenu open={open} onClose={() => setOpen(false)} context={context} /> : null}
    </>
  );
}
