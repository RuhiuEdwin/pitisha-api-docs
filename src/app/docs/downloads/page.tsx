import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { Callout } from "@/components/callouts";
import { API_VERSION } from "@/content/config";
import { RESOURCES } from "@/content/api";
import { pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";

const page = pageBySlug("downloads")!;
export const metadata: Metadata = pageMeta(page);
const count = RESOURCES.reduce((n, r) => n + r.endpoints.length, 0);

export default function Downloads() {
  const files = [
    { href: "/openapi.json", name: "openapi.json", what: "OpenAPI 3.1. Import it into Insomnia, Stoplight or a code generator." },
    { href: "/postman_collection.json", name: "postman_collection.json", what: "Postman collection v2.1. Set the variables baseUrl and secretKey after you import it." },
  ];
  return (
    <PageFrame page={page}>
      <Callout tone="proposed" title="Proposed">Both files describe the proposed API. The server URL is a placeholder until a real sandbox URL exists.</Callout>
      <p className="max-w-[68ch]">Version <strong className="font-mono">{API_VERSION}</strong>, {count} endpoints in {RESOURCES.length} resources. Both files are built from the same data as the reference, so they cannot drift from it.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {files.map((f) => (
          <li key={f.href} className="rounded-[var(--pd-radius-md)] border border-edge bg-surface p-5">
            <p className="font-mono text-[14px] font-medium">{f.name}</p>
            <p className="mt-1 text-[14px] text-fg-muted">{f.what}</p>
            <a href={f.href} download className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] bg-primary px-4 text-[14px] font-medium text-primary-fg hover:opacity-90"><Download size={15} aria-hidden="true" />Download</a>
          </li>
        ))}
      </ul>
      <h2 className="pd-h2 mt-10">For AI tools</h2>
      <p className="mt-2 max-w-[68ch] text-[15px]">Every page is also available as Markdown: add <code className="font-mono">index.md</code> to its address. <a className="underline" href="/llms.txt">llms.txt</a> lists them all, and <a className="underline" href="/llms-full.txt">llms-full.txt</a> is the whole site in one file.</p>
    </PageFrame>
  );
}
