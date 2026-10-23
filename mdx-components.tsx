import type { MDXComponents } from "mdx/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Heading } from "@/components/ui/Heading";

export const mdxComponents: MDXComponents = {
  h2: (props) => <Heading level={2} look={3} className="reveal mt-16 mb-5 first:mt-0" {...props} />,
  h3: (props) => <Heading level={3} look={4} className="reveal mt-10 mb-3" {...props} />,
  p: (props) => <p className="t-body reveal my-4 text-pretty" {...props} />,
  ul: (props) => <ul className="t-body reveal my-4 list-disc space-y-3 pl-6 marker:text-muted" {...props} />,
  ol: (props) => <ol className="t-body reveal my-4 list-decimal space-y-3 pl-6 marker:text-muted" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  code: (props) => (
    <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[0.88em]" {...props} />
  ),
  a: ({ href = "", children }) => <ExternalLink href={href}>{children}</ExternalLink>,
};
