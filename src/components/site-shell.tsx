import { DocsShell } from "@/components/docs-shell";
import { API_VERSION, PROPOSED, STATUS_URL } from "@/content/config";
import { NAV } from "@/lib/docs";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <DocsShell nav={NAV} statusHref={STATUS_URL ?? "/docs/status/"} proposed={PROPOSED} version={API_VERSION}>{children}</DocsShell>;
}
