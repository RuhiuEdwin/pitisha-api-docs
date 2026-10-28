import { codeToHtml } from "shiki";

export async function hl(code: string, lang: string) {
  return codeToHtml(code, { lang: lang === "curl" ? "bash" : lang, theme: "github-dark-default" });
}
