"use client";

import { useEffect, useRef } from "react";
import { rakitReact } from "@/components/mascot/react";

/**
 * Rakit yang dijatuhkan di sebuah baris ledger membuka pratinjau baris itu (`data-picked`),
 * sampai pengunjung menyorot baris lain. Pemilihan pratinjaunya tetap CSS di WorkLedger.
 */
export function LedgerPick() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ledger = ref.current?.parentElement?.querySelector<HTMLElement>(".ledger");
    if (!ledger) return;
    const clear = () => {
      for (const row of ledger.querySelectorAll(".ledger-row[data-picked]")) {
        row.removeAttribute("data-picked");
      }
    };
    const onDrop = (ev: Event) => {
      const row = (ev.target as Element).closest(".ledger-row");
      if (!row) return;
      clear();
      row.setAttribute("data-picked", "");
      rakitReact({ zone: ledger, expression: "senang", ms: 1400 });
    };
    const onOther = (ev: Event) => {
      if ((ev.target as Element).closest(".ledger-row:not([data-picked])")) clear();
    };
    ledger.addEventListener("rakit:drop", onDrop);
    ledger.addEventListener("pointerover", onOther);
    ledger.addEventListener("focusin", onOther);
    return () => {
      ledger.removeEventListener("rakit:drop", onDrop);
      ledger.removeEventListener("pointerover", onOther);
      ledger.removeEventListener("focusin", onOther);
    };
  }, []);

  return <span ref={ref} hidden />;
}
