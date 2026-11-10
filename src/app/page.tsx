import { ArrowRight, BookOpen, Download, FileCode2, Flag, ShieldAlert, Webhook, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import Link from "next/link";
import { IconTile } from "pitisha-design";
import { RequestCode } from "@/components/code";
import { SiteShell } from "@/components/site-shell";
import { RESOURCES } from "@/content/api";
import { API_VERSION } from "@/content/config";
import { reqOf } from "@/lib/snippets";

const STEPS = [
  { n: "1", t: "Get a key", d: "Create an app in the partners portal and copy its secret key. Send it as a Bearer token." },
  { n: "2", t: "Collect a payment", d: "POST /v1/collections with an amount in cents and a reference. The customer pays by M-Pesa." },
  { n: "3", t: "Read the result", d: "Wait for the collection.recorded webhook, or fetch the collection. It is pending, succeeded or failed." },
];

const PATHS = [
  { href: "/docs/reference/collections/", tone: "ok" as const, icon: ArrowDownToLine, t: "Collect", d: "Ask a customer to pay over M-Pesa, or by card, Airtel Money or PesaLink where enabled, and read one clear result." },
  { href: "/docs/reference/payouts/", tone: "sun" as const, icon: ArrowUpFromLine, t: "Pay out", d: "Send money from a wallet to an M-Pesa phone number, with approvals when you need them." },
  { href: "/docs/webhooks/", tone: "rail" as const, icon: Webhook, t: "Webhooks", d: "Signed events for every result, and a verifier to check your code." },
  { href: "/docs/errors/", tone: "neutral" as const, icon: ShieldAlert, t: "Errors", d: "Each code with its cause and fix, and whether it is safe to retry." },
];

export default async function Home() {
  const e = RESOURCES[0].endpoints[0];
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1100px]">
        <section aria-labelledby="hero-h" className="grid gap-8 py-2 lg:grid-cols-[1fr_1.05fr] lg:py-6">
          <div className="self-center">
            <p className="font-mono text-[12px] text-fg-muted">Tefo API docs · v{API_VERSION}</p>
            <h1 id="hero-h" className="pd-h1 mt-3">Every payment,{" "}<span className="hl">in its place.</span></h1>
            <p className="mt-4 max-w-[52ch] text-[17px] text-fg-muted">Tefo is a payment gateway with one API: collect payments, pay out, and see every transaction. M-Pesa and paybill come first, with other rails behind enablement. Amounts are in cents, so <code className="font-mono text-fg">250000</code> is KES 2,500.00.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/quickstart/" className="pd-btn" data-variant="primary">Start the quickstart <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/docs/reference/collections/" className="pd-btn" data-variant="secondary">API reference</Link>
            </div>
          </div>
          <div className="min-w-0 self-center">
            <p className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-fg-muted"><span className="font-mono">POST /v1/collections</span><Link href="/docs/reference/collections/#create-collection" className="inline-flex min-h-11 items-center underline">Try it, simulated</Link></p>
            <RequestCode req={reqOf(e)} />
          </div>
        </section>

        <section aria-labelledby="steps-h" className="mt-10">
          <h2 id="steps-h" className="pd-h2">Quickstart in three steps</h2>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-[var(--pd-radius-lg)] bg-surface p-5 shadow-pd-sm">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--pd-amber-300)] font-mono text-[13px] font-medium text-[var(--pd-night-950)]" aria-hidden="true">{s.n}</span>
                <h3 className="mt-3 text-[16px] font-medium"><span className="pd-vh">Step {s.n}: </span>{s.t}</h3>
                <p className="mt-1 text-[14px] text-fg-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[14px]"><Link href="/docs/quickstart/" className="inline-flex min-h-11 items-center gap-1 font-medium underline">Follow it with working code <ArrowRight size={14} aria-hidden="true" /></Link></p>
        </section>

        <section aria-labelledby="paths-h" className="mt-10">
          <h2 id="paths-h" className="pd-h2">Start with the job you have</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {PATHS.map((c) => (
              <li key={c.href}><Link href={c.href} className="group flex h-full flex-col rounded-[var(--pd-radius-lg)] bg-surface shadow-pd-sm p-5 hover:shadow-pd-md">
                <IconTile tone={c.tone}><c.icon aria-hidden="true" /></IconTile>
                <h3 className="mt-3 text-[16px] font-medium">{c.t}</h3>
                <p className="mt-1 flex-1 text-[14px] text-fg-muted">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">Open <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" /></span>
              </Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cta-h" className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[var(--pd-radius-lg)] bg-[var(--pd-banner-bg)] p-6 text-[var(--pd-banner-fg)] sm:p-8">
          <div><h2 id="cta-h" className="pd-h2">Make your first collection in five minutes.</h2><p className="mt-1 text-[15px]">Sandbox key, one request, one webhook.</p></div>
          <Link href="/docs/quickstart/" className="pd-btn" data-variant="primary" style={{ ["--_bg" as string]: "var(--pd-night-950)", ["--_fg" as string]: "var(--pd-ivory-100)", ["--_bd" as string]: "var(--pd-night-950)" }}>Start the quickstart <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <section aria-labelledby="tools-h" className="mt-10 grid gap-3 rounded-[var(--pd-radius-lg)] bg-surface p-5 shadow-pd-sm sm:grid-cols-2 lg:grid-cols-4">
          <h2 id="tools-h" className="pd-vh">Tools</h2>
          <Link href="/docs/downloads/" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><Download size={18} aria-hidden="true" /><span><strong className="block font-medium">OpenAPI and Postman</strong><span className="text-fg-muted">Import the API.</span></span></Link>
          <Link href="/docs/go-live/" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><Flag size={18} aria-hidden="true" /><span><strong className="block font-medium">Go-live checklist</strong><span className="text-fg-muted">Before real payments.</span></span></Link>
          <Link href="/docs/changelog/" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><BookOpen size={18} aria-hidden="true" /><span><strong className="block font-medium">Changelog</strong><span className="text-fg-muted">Version {API_VERSION}.</span></span></Link>
          <a href="/llms.txt" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><FileCode2 size={18} aria-hidden="true" /><span><strong className="block font-medium">For AI tools</strong><span className="text-fg-muted">llms.txt.</span></span></a>
        </section>
      </div>
    </SiteShell>
  );
}
