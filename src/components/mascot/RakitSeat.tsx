import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { ActName } from "./acts";
import type { SeatTone } from "./companion";
import type { Expression } from "./rakit";
import { RakitSvg } from "./RakitSvg";

type Props = {
  /** Ekspresi Rakit saat duduk di sini. */
  expression?: Expression;
  /** Aksi yang dimainkan saat Rakit tiba (misalnya melambai di kontak). */
  arrive?: ActName;
  /** "light": di atas bidang terang. "inverse": di atas bidang warna teks (kebalikan tema). */
  tone?: SeatTone;
  /** Tampilkan Rakit statis dari server sampai Rakit hidup tiba (tanpa JS tetap terlihat). */
  fallback?: boolean;
  /** Lebar Rakit di kursi ini (px, layar >= 640 px; lebih kecil 20% di ponsel). Tinggi kursi
   *  minimal 1,3125 x lebar. */
  size?: number;
  className?: string;
};

/**
 * Tempat duduk Rakit di sebuah bagian halaman. Kotaknya berukuran tetap sehingga tidak ada CLS;
 * lebarnya menjadi jalur aksi "jalan". Satu Rakit hidup (RakitCompanion) berpindah ke kursi yang
 * paling dekat dengan pandangan pengunjung, jadi selalu ada satu Rakit per layar.
 */
export function RakitSeat({
  expression = "netral",
  arrive,
  tone,
  fallback = false,
  size = 112,
  className,
}: Props) {
  return (
    <span
      aria-hidden="true"
      data-rakit-seat=""
      data-expression={expression}
      data-arrive={arrive}
      data-tone={tone}
      className={cn("rakit-seat", className)}
      style={{ "--rakit-size": `${size}px` } as CSSProperties}
    >
      {fallback ? (
        <RakitSvg
          expression={expression}
          className={cn("rakit-static", tone && `rakit-tone-${tone}`)}
        />
      ) : null}
    </span>
  );
}
