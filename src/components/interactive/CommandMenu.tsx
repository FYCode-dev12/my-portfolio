"use client";

import {
  Briefcase,
  Code,
  Copy,
  CornerDownLeft,
  FileDown,
  FolderOpen,
  House,
  Mail,
  Search,
  SunMoon,
  User,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import type { CommandContext } from "./command-data";

const GROUPS = ["Halaman", "Proyek", "Aksi", "Tautan"] as const;
type Group = (typeof GROUPS)[number];

type Command = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: LucideIcon;
  run: () => void | Promise<void>;
};

type Props = { open: boolean; onClose: () => void; context: CommandContext };

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm bg-bg px-1.5 font-mono text-[0.8125rem] text-muted">
      {children}
    </kbd>
  );
}

export function CommandMenu({ open, onClose, context }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return [
      { id: "home", group: "Halaman", label: "Beranda", hint: "/", icon: House, run: go("/") },
      {
        id: "projects",
        group: "Halaman",
        label: "Semua proyek",
        hint: "/projects",
        icon: FolderOpen,
        run: go("/projects"),
      },
      {
        id: "about",
        group: "Halaman",
        label: "Tentang",
        hint: "/about",
        icon: User,
        run: go("/about"),
      },
      {
        id: "contact",
        group: "Halaman",
        label: "Kontak",
        hint: "/contact",
        icon: Mail,
        run: go("/contact"),
      },
      ...context.projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: "Proyek",
        label: p.title,
        hint: p.kind,
        icon: Code,
        run: go(`/projects/${p.slug}`),
      })),
      {
        id: "theme",
        group: "Aksi",
        label: "Ganti tema terang/gelap",
        icon: SunMoon,
        run: () => toggleTheme(),
      },
      {
        id: "copy-email",
        group: "Aksi",
        label: "Salin alamat email",
        icon: Copy,
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
              label: "Buka CV",
              hint: "PDF",
              icon: FileDown,
              run: external(context.cvHref),
            } satisfies Command,
          ]
        : []),
      {
        id: "github",
        group: "Tautan",
        label: "GitHub",
        hint: "github.com",
        icon: Code,
        run: external(context.github),
      },
      {
        id: "linkedin",
        group: "Tautan",
        label: "LinkedIn",
        hint: "linkedin.com",
        icon: Briefcase,
        run: external(context.linkedin),
      },
    ];
  }, [context, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Urutan tampilan per grup; indeks `active` mengikuti urutan ini.
  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({ group, items: results.filter((c) => c.group === group) })).filter(
        (g) => g.items.length > 0,
      ),
    [results],
  );
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

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

  useEffect(() => {
    const id = flat[active] ? `${listId}-${flat[active].id}` : null;
    if (!id) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, flat, listId]);

  async function execute(command: Command | undefined) {
    if (!command) return;
    await command.run();
    // Aksi salin tetap membuka palette agar umpan baliknya terbaca.
    if (command.id !== "copy-email") onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      void execute(flat[active]);
    }
  }

  const activeId = flat[active] ? `${listId}-${flat[active].id}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label="Palet perintah"
      className="command-dialog m-0 mx-auto mt-[12vh] max-h-[72vh] w-[min(38rem,calc(100vw-2rem))] overflow-hidden rounded-lg bg-surface p-0 text-fg"
    >
      <div data-ui className="flex max-h-[72vh] flex-col">
        <div className="flex h-15 shrink-0 items-center gap-3 border-b border-border px-5">
          <Search aria-hidden="true" className="size-[1.125rem] shrink-0 text-muted" />
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
            placeholder="Cari halaman, proyek, atau aksi…"
            spellCheck={false}
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Hasil"
          className="command-list overflow-y-auto overscroll-contain px-2 pt-1 pb-2"
        >
          {flat.length === 0 ? (
            <p role="presentation" className="px-3 py-10 text-center text-sm text-muted">
              Tidak ada yang cocok dengan “{query.trim()}”.
            </p>
          ) : (
            grouped.map(({ group, items }) => {
              const headingId = `${listId}-g-${group}`;
              return (
                <div key={group} role="group" aria-labelledby={headingId} className="pt-2">
                  <p
                    id={headingId}
                    role="presentation"
                    className="px-3 pt-1 pb-1.5 text-[0.8125rem] text-muted"
                  >
                    {group}
                  </p>
                  {items.map((command) => {
                    const index = flat.indexOf(command);
                    const selected = index === active;
                    const Icon = command.icon;
                    return (
                      <div
                        key={command.id}
                        id={`${listId}-${command.id}`}
                        role="option"
                        aria-selected={selected}
                        onPointerMove={() => {
                          if (!selected) setActive(index);
                        }}
                        onClick={() => void execute(command)}
                        className="command-option group/opt flex h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-[0.9375rem]"
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted group-aria-selected/opt:text-accent"
                        />
                        <span className="min-w-0 flex-1 truncate">{command.label}</span>
                        {command.hint ? (
                          <span className="hidden max-w-[45%] truncate font-mono text-[0.8125rem] text-muted sm:block">
                            {command.hint}
                          </span>
                        ) : null}
                        <CornerDownLeft
                          aria-hidden="true"
                          className="hidden size-4 shrink-0 text-accent group-aria-selected/opt:block"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex h-11 shrink-0 items-center justify-between gap-4 border-t border-border px-5 text-[0.8125rem] text-muted">
          <p role="status" className="truncate">
            {notice || `${flat.length} hasil`}
          </p>
          <p aria-hidden="true" className="hidden items-center gap-3 sm:flex">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> pilih
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd> buka
            </span>
          </p>
        </div>
      </div>
    </dialog>
  );
}
