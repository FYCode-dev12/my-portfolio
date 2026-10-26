"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toggleTheme } from "@/lib/theme";
import type { CommandContext, CommandProject } from "./command-data";

type SkillLine = { key: string; items: string[] };
type Entry = { id: number; cmd: string; output: ReactNode };

type Props = {
  name: string;
  role: string;
  campus: string;
  skills: SkillLine[];
  context: CommandContext;
};

const COMMANDS = [
  "help",
  "whoami",
  "proyek",
  "stack",
  "buka",
  "kontak",
  "cv",
  "tema",
  "clear",
] as const;
const SUGGESTIONS = ["help", "proyek", "stack", "kontak"] as const;

const statusText: Record<CommandProject["status"], string> = {
  live: "live",
  "in-progress": "staging",
  archived: "arsip",
};

function host(url?: string) {
  return url ? new URL(url).host : "—";
}

function ProjectTable({ projects }: { projects: CommandProject[] }) {
  return (
    <table className="w-full max-w-md text-left whitespace-nowrap">
      <thead className="sr-only">
        <tr>
          <th scope="col">Proyek</th>
          <th scope="col">Status</th>
          <th scope="col" className="hidden sm:table-cell">
            Domain
          </th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.slug}>
            <td className="pr-4">
              <Link
                href={`/projects/${p.slug}`}
                className="text-fg underline-offset-4 hover:underline"
              >
                {p.slug}
              </Link>
            </td>
            <td className="pr-4">
              <span className={p.status === "live" ? "text-accent" : "text-muted"}>
                {statusText[p.status]}
              </span>
            </td>
            <td className="hidden text-muted sm:table-cell">{host(p.live)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Terminal({ name, role, campus, skills, context }: Props) {
  const router = useRouter();
  const nextId = useRef(2);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      cmd: "whoami",
      output: (
        <p>
          <span className="text-fg">{name}</span>
          <br />
          {role}, {campus}
        </p>
      ),
    },
    { id: 1, cmd: "proyek", output: <ProjectTable projects={context.projects} /> },
  ]);

  useEffect(() => {
    // Hanya gulir log sendiri, bukan halaman, dan hanya setelah pengunjung mengetik.
    if (touched && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries, touched]);

  function respond(raw: string): ReactNode | "clear" {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    switch (cmd.toLowerCase()) {
      case "":
        return null;
      case "help":
        return (
          <ul>
            <li>
              <span className="text-fg">whoami</span> siapa saya
            </li>
            <li>
              <span className="text-fg">proyek</span> daftar sistem yang dirilis
            </li>
            <li>
              <span className="text-fg">buka</span> &lt;slug&gt; buka studi kasus
            </li>
            <li>
              <span className="text-fg">stack</span> teknologi yang dipakai
            </li>
            <li>
              <span className="text-fg">kontak</span> email dan profil
            </li>
            <li>
              <span className="text-fg">cv</span> unduh CV
            </li>
            <li>
              <span className="text-fg">tema</span> ganti terang/gelap
            </li>
            <li>
              <span className="text-fg">clear</span> bersihkan layar
            </li>
          </ul>
        );
      case "whoami":
        return (
          <p>
            <span className="text-fg">{name}</span>, {role}
          </p>
        );
      case "ls":
      case "proyek":
        return <ProjectTable projects={context.projects} />;
      case "stack":
        return (
          <ul>
            {skills.map((s) => (
              <li key={s.key}>
                <span className="text-accent">{s.key}</span>: {s.items.join(", ")}
              </li>
            ))}
          </ul>
        );
      case "buka":
      case "open":
      case "cd": {
        const slug = args[0]?.replace(/^~?\/?(proyek\/)?/, "");
        const project = context.projects.find((p) => p.slug === slug);
        if (!slug)
          return <p>pakai: buka &lt;slug&gt;, misalnya buka {context.projects[0]?.slug}</p>;
        if (!project) return <p className="text-fg">buka: proyek tidak ditemukan: {slug}</p>;
        router.push(`/projects/${project.slug}`);
        return <p>membuka {project.title}…</p>;
      }
      case "kontak":
        return (
          <ul>
            <li>
              email{" "}
              <a
                className="text-fg underline-offset-4 hover:underline"
                href={`mailto:${context.email}`}
              >
                {context.email}
              </a>
            </li>
            <li>
              github{" "}
              <a
                className="text-fg underline-offset-4 hover:underline"
                href={context.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {host(context.github)}
                {new URL(context.github).pathname}
              </a>
            </li>
            <li>
              linkedin{" "}
              <a
                className="text-fg underline-offset-4 hover:underline"
                href={context.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {host(context.linkedin)}
                {new URL(context.linkedin).pathname}
              </a>
            </li>
          </ul>
        );
      case "cv":
        return context.cvHref ? (
          <p>
            <a
              className="text-fg underline-offset-4 hover:underline"
              href={context.cvHref}
              download
            >
              cv.pdf
            </a>{" "}
            siap diunduh.
          </p>
        ) : (
          <p>cv: belum tersedia.</p>
        );
      case "tema":
      case "theme":
        toggleTheme();
        return <p>tema diganti.</p>;
      case "clear":
        return "clear";
      case "sudo":
        return <p>sudo: izin ditolak. Coba ajak magang dulu.</p>;
      default:
        return (
          <p>
            <span className="text-fg">{cmd}</span>: perintah tidak dikenal. Ketik{" "}
            <span className="text-fg">help</span>.
          </p>
        );
    }
  }

  function run(raw: string) {
    setTouched(true);
    const output = respond(raw);
    if (output === "clear") {
      setEntries([]);
    } else {
      setEntries((list) => [...list, { id: nextId.current++, cmd: raw.trim(), output }]);
    }
    if (raw.trim()) setPast((list) => [...list, raw.trim()]);
    setCursor(null);
    setValue("");
  }

  function complete() {
    const [cmd = "", arg] = value.trimStart().split(/\s+/);
    if (arg !== undefined) {
      const match = context.projects.find((p) => p.slug.startsWith(arg));
      if (match) setValue(`${cmd} ${match.slug}`);
      return;
    }
    const match = COMMANDS.find((c) => c.startsWith(cmd));
    if (match) setValue(match === "buka" ? "buka " : match);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab" && value.trim()) {
      event.preventDefault();
      complete();
    } else if (event.key === "ArrowUp" && past.length) {
      event.preventDefault();
      const i = cursor === null ? past.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(past[i]);
    } else if (event.key === "ArrowDown" && cursor !== null) {
      event.preventDefault();
      const i = cursor + 1;
      if (i >= past.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(i);
        setValue(past[i]);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div
      data-ui
      className="terminal flex h-[24rem] flex-col overflow-hidden rounded-lg bg-surface font-mono text-[0.875rem] leading-6 text-muted transition-shadow has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-accent sm:h-[26rem]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 text-[0.8125rem]">
        <span>febrian@itera: ~</span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="pulse-dot size-2 rounded-full bg-accent" />
          zsh
        </span>
      </div>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Keluaran terminal"
        className="flex-1 overflow-y-auto px-4 py-3"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            <p>
              <span className="text-accent">~$</span> <span className="text-fg">{entry.cmd}</span>
            </p>
            {entry.output ? <div className="whitespace-pre-wrap">{entry.output}</div> : null}
          </div>
        ))}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(value);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="terminal-input" className="text-accent">
            ~$<span className="sr-only"> perintah terminal</span>
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            placeholder="ketik help"
            className="terminal-input min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-muted/70"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => run(s)}
            className="press rounded-sm bg-bg px-2.5 py-1 text-[0.8125rem] text-fg transition-colors hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
