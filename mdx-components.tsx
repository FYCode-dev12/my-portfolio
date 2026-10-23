import type { MDXComponents } from "mdx/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Heading } from "@/components/ui/Heading";

export const mdxComponents: MDXComponents = {
  h2: (props) => <Heading level={2} look={3} className="mt-12 mb-4 first:mt-0" {...props} />,
  h3: (props) => <Heading level={3} look={4} className="mt-8 mb-3" {...props} />,
  p: (props) => <p className="my-4 leading-7 text-fg" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 marker:text-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-muted" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  a: ({ href = "", children }) => <ExternalLink href={href}>{children}</ExternalLink>,
};
