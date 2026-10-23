export type SiteStatus = { ok: boolean; code: number | null; ms: number | null };
export type StatusResponse = { checkedAt: string; sites: Record<string, SiteStatus> };
