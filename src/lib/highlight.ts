import { codeToHtml } from "shiki";
import { LANGS, type Lang } from "@/lib/snippets";

const THEME = "github-dark-default";
const langOf = (l: string) => (l === "curl" ? "bash" : l === "text" ? "text" : l);

/** The inner markup of a highlighted block, without Shiki's own <pre>, so the panel can supply its own. */
export async function hlInner(code: string, lang: string): Promise<string> {
  const html = await codeToHtml(code, { lang: langOf(lang), theme: THEME });
  const m = /<code>([\s\S]*)<\/code>/.exec(html);
  return m ? m[1] : html;
}

export const hl = (code: string, lang: string) => codeToHtml(code, { lang: langOf(lang), theme: THEME });

export interface Sample { id: string; label: string; code: string; html: string }

export async function samplesOf(code: Partial<Record<Lang, string>>): Promise<Sample[]> {
  return Promise.all(LANGS.filter((l) => code[l.id]).map(async (l) => ({ id: l.id, label: l.label, code: code[l.id]!, html: await hlInner(code[l.id]!, l.shiki) })));
}
