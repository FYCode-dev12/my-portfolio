import type { CSSProperties } from "react";

/** Urutan masuk untuk elemen yang tampil bergantian (dibaca oleh `--i` di CSS). */
export const stagger = (index: number) => ({ "--i": index }) as CSSProperties;
