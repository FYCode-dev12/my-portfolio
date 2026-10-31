/** Data serializable yang dikirim server ke command palette dan terminal. */
export type CommandProject = {
  slug: string;
  title: string;
  kind?: string;
  status: "live" | "demo" | "in-progress" | "archived";
  live?: string;
};

export type CommandContext = {
  projects: CommandProject[];
  cvHref?: string;
  email: string;
  github: string;
  linkedin: string;
};
