import { ERRORS, RESOURCES } from "@/content/api";
import type { ExplorerError } from "@/components/error-explorer";

export function explorerErrors(): ExplorerError[] {
  return ERRORS.map((e) => ({
    ...e,
    usedBy: RESOURCES.flatMap((r) => r.endpoints.filter((x) => x.errors?.includes(e.code)).map((x) => ({ label: x.title, href: `/docs/reference/${r.id}/#${x.id}` }))).slice(0, 6),
  }));
}
