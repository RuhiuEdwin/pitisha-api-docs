import { DocsShell } from "@/components/docs-shell";
import { NAV, searchIndex } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell nav={NAV} items={searchIndex()}>{children}</DocsShell>;
}
