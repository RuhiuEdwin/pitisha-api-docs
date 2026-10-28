import { ArrowRight, BookOpen, Braces, Webhook } from "lucide-react";
import Link from "next/link";
import { hl } from "@/lib/highlight";
import { snippet } from "@/lib/snippets";
import { RESOURCES } from "@/content/api";

export default async function Home() {
  const e = RESOURCES[0].endpoints[0];
  const code = await hl(snippet(e, "curl"), "curl");
  const cards = [
    { href: "/docs/quickstart/", icon: BookOpen, t: "Quickstart", d: "Make your first sandbox payment in five minutes." },
    { href: "/docs/reference/collections/", icon: Braces, t: "API reference", d: "Every endpoint, with code in cURL, JavaScript and Python and a simulated try-it." },
    { href: "/docs/webhooks/", icon: Webhook, t: "Webhooks", d: "Signed events and how to verify them." },
  ];
  return (
    <main id="content" className="bg-night text-ivory">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <div className="flex items-center gap-2.5"><svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true"><rect x="3" y="2" width="4.5" height="20" fill="#F4F6FA" /><rect x="16.5" y="2" width="4.5" height="20" fill="#F4F6FA" /><rect x="7.5" y="14.2" width="9" height="2.6" fill="#E3BF74" /></svg><span className="text-lg">Pitisha</span><span className="rounded-md bg-ivory/10 px-2 py-0.5 text-xs font-medium text-gold">API</span></div>
          <h1 className="mt-10 text-5xl font-light leading-[1.05] tracking-tight lg:text-6xl">One integration.<br />Every way Kenya pays.</h1>
          <p className="mt-6 max-w-lg text-lg text-ivory/70">Collect, pay out and settle through one API, and keep one record of every shilling, in and out. Money goes straight into your own till.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/docs/quickstart/" className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-5 text-sm font-medium text-night hover:brightness-95">Start with the quickstart <ArrowRight size={16} /></Link>
            <Link href="/docs/reference/collections/" className="inline-flex h-11 items-center rounded-lg border border-ivory/25 px-5 text-sm font-medium hover:border-ivory">API reference</Link>
          </div>
        </div>
        <div className="self-center overflow-hidden rounded-2xl bg-deep shadow-2xl"><p className="border-b border-ivory/10 px-4 py-2 text-xs text-ivory/60">POST /v1/collections</p><div className="code-dark overflow-x-auto" dangerouslySetInnerHTML={{ __html: code }} /></div>
      </div>
      <div className="bg-paper text-ink">
        <div className="mx-auto grid max-w-[1180px] gap-4 px-6 py-12 md:grid-cols-3">
          {cards.map((c) => <Link key={c.href} href={c.href} className="group rounded-2xl border border-line p-6 hover:border-ink"><c.icon size={22} className="text-gold-d" /><h2 className="mt-4 text-lg font-medium">{c.t}</h2><p className="mt-1 text-[14px] text-muted">{c.d}</p><span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}
        </div>
      </div>
    </main>
  );
}
