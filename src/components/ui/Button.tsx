import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg border-accent hover:opacity-90",
  secondary: "bg-transparent text-fg border-border hover:border-accent",
  ghost: "bg-transparent text-muted border-transparent hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
};

type CommonProps = { variant?: Variant; size?: Size };
type AnchorProps = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };
type NativeButtonProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };

export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<"a"> & { href: string };
    return <Link href={href} className={classes} {...anchorProps} />;
  }
  const { type = "button", ...buttonProps } = rest as ComponentPropsWithoutRef<"button">;
  return <button type={type} className={classes} {...buttonProps} />;
}
