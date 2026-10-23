import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "quiet";

const variants: Record<Variant, string> = {
  primary:
    "min-h-12 bg-field px-6 text-field-fg hover:bg-fg hover:text-bg active:translate-y-px",
  quiet: "min-h-11 px-1 text-fg link",
};

type CommonProps = { variant?: Variant };
type AnchorProps = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };
type NativeButtonProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", className, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[background-color,color,transform] duration-150 disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<"a"> & { href: string };
    if (href.startsWith("mailto:") || anchorProps.download !== undefined) {
      return <a href={href} className={classes} {...anchorProps} />;
    }
    return <Link href={href} className={classes} {...anchorProps} />;
  }
  const { type = "button", ...buttonProps } = rest as ComponentPropsWithoutRef<"button">;
  return <button type={type} className={classes} {...buttonProps} />;
}
