"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import type { CommandContext } from "./command-data";

type Command = {
  id: string;
  group: "Halaman" | "Proyek" | "Aksi" | "Tautan";
  label: string;
  hint?: string;
  run: () => void | Promise<void>;
};

type Props = { open: boolean; onClose: () => void; context: CommandContext };

export function CommandMenu({ open, onClose, context }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
    };
    const list: Command[] = [
      { id: "home", group: "Halaman", label: "Beranda", hint: "/", run: go("/") },
      {
        id: "projects",
        group: "Halaman",
        label: "Semua proyek",
        hint: "/projects",
        run: go("/projects"),
      },
      { id: "about", group: "Halaman", label: "Tentang", hint: "/about", run: go("/about") },
      { id: "contact", group: "Halaman", label: "Kontak", hint: "/contact", run: go("/contact") },
      ...context.projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: "Proyek",
        label: p.title,
        hint: p.kind,
        run: go(`/projects/${p.slug}`),
      })),
      {
        id: "theme",
        group: "Aksi",
        label: "Ganti tema terang/gelap",
        run: () => toggleTheme(),
      },
      {
        id: "copy-email",
        group: "Aksi",
        label: "Salin alamat email",
        hint: context.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(context.email);
            setNotice(`Tersalin: ${context.email}`);
          } catch {
            setNotice(`Gagal menyalin. Alamatnya: ${context.email}`);
          }
        },
      },
      ...(context.cvHref
        ? [
            {
              id: "cv",
              group: "Aksi",
              label: "Buka CV (PDF)",
              run: external(context.cvHref),
            } satisfies Command,
          ]
        : []),
      {
        id: "github",
        group: "Tautan",
        label: "GitHub",
        hint: "github.com",
        run: external(context.github),
      },
      {
        id: "linkedin",
        group: "Tautan",
        label: "LinkedIn",
        hint: "linkedin.com",
        run: external(context.linkedin),
      },
    ];
    return list;
  }, [context, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setActive(0);
      setNotice("");
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function execute(command: Command | undefined) {
    if (!command) return;
    await command.run();
    // Aksi salin tetap membuka palette agar umpan baliknya terbaca.
    if (command.id !== "copy-email") onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      void execute(results[active]);
    }
  }

  const activeId = results[active] ? `${listId}-${results[active].id}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label="Palet perintah"
      className="command-dialog m-0 mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] max-h-[70vh] overflow-hidden rounded-lg bg-surface p-0 text-fg"
    >
      <div data-ui className="flex max-h-[70vh] flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span aria-hidden="true" className="font-mono text-accent">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Cari halaman, proyek, atau aksi"
            placeholder="Ketik perintah atau nama proyek…"
            className="h-14 flex-1 bg-transparent font-mono text-[0.9375rem] outline-none placeholder:text-muted"
          />
          <kbd className="font-mono text-[0.8125rem] text-muted">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Hasil" className="overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted">Tidak ada yang cocok.</li>
          ) : (
            results.map((command, i) => (
              <li
                key={command.id}
                id={`${listId}-${command.id}`}
                role="option"
                aria-selected={i === active}
                onPointerMove={() => setActive(i)}
                onClick={() => void execute(command)}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-2.5 text-[0.9375rem] aria-selected:bg-accent aria-selected:text-accent-fg"
              >
                <span className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-[0.8125rem] opacity-70">
                    {command.group}
                  </span>
                  {command.label}
                </span>
                {command.hint ? (
                  <span className="truncate font-mono text-[0.8125rem] opacity-70">
                    {command.hint}
                  </span>
                ) : null}
              </li>
            ))
          )}
        </ul>
        <p
          role="status"
          className="border-t border-border px-4 py-2.5 font-mono text-[0.8125rem] text-muted"
        >
          {notice || "↑↓ pilih · Enter jalankan · Esc tutup"}
        </p>
      </div>
    </dialog>
  );
}
