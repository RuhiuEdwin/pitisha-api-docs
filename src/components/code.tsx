import { CodeTabs } from "@/components/code-tabs";
import { hlInner, samplesOf } from "@/lib/highlight";
import { LANGS, render, type Lang, type Req } from "@/lib/snippets";

/** Server component: highlight a request in every language, or one fixed block. */
export async function RequestCode({ req, title }: { req: Req; title?: string }) {
  const code = Object.fromEntries(LANGS.map((l) => [l.id, render(req, l.id)])) as Record<Lang, string>;
  return <CodeTabs samples={await samplesOf(code)} title={title} label="Language" />;
}

export async function LangCode({ code, title }: { code: Partial<Record<Lang, string>>; title?: string }) {
  return <CodeTabs samples={await samplesOf(code)} title={title} label="Language" />;
}

export async function FixedCode({ code, lang, title }: { code: string; lang: string; title: string }) {
  return <CodeTabs samples={[{ id: "one", label: title, code, html: await hlInner(code, lang) }]} title={title} />;
}
