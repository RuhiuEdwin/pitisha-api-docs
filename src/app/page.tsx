import { AlertTriangle, ArrowRight, BookOpen, Braces, Download, FileCode2, Flag, ListChecks, Rocket, ShieldAlert, Webhook } from "lucide-react";
import Link from "next/link";
import { RequestCode } from "@/components/code";
import { SiteShell } from "@/components/site-shell";
import { RESOURCES } from "@/content/api";
import { API_VERSION, PROPOSED } from "@/content/config";
import { reqOf } from "@/lib/snippets";

const PATHS = [
  { href: "/docs/quickstart/", icon: Rocket, t: "Quickstart in 5 minutes", d: "Get a sandbox key, collect a test payment, read the result, force a failure." },
  { href: "/docs/recipes/", icon: ListChecks, t: "Recipes", d: "Accept an STK push, reconcile a paybill payment, retry safely, verify a webhook, switch to live." },
  { href: "/docs/reference/collections/", icon: Braces, t: "API reference", d: "Every endpoint with units explained, code in four languages and a simulated Try it." },
  { href: "/docs/webhook-events/", icon: Webhook, t: "Webhook events", d: "Every event with a payload example, and a signature verifier." },
  { href: "/docs/errors/", icon: ShieldAlert, t: "Error explorer", d: "Code, meaning, cause and fix, with whether it is safe to retry." },
  { href: "/docs/go-live/", icon: Flag, t: "Go-live checklist", d: "Everything to finish before real payments, in the order the portal asks." },
];

export default async function Home() {
  const e = RESOURCES[0].endpoints[0];
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1100px]">
        <section aria-labelledby="hero-h" className="overflow-hidden rounded-[var(--pd-radius-lg)] bg-night text-ivory">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr]">
            <div className="self-center">
              <p className="text-[12px] font-medium uppercase tracking-wider text-gold">Tefo API docs · v{API_VERSION}</p>
              <h1 id="hero-h" className="pd-h1 mt-3 text-ivory">One integration.<br />Every way Kenya pays.</h1>
              <p className="mt-4 max-w-[46ch] text-[17px] text-ivory/75">Collect, pay out and settle through one API, and keep one record of every shilling, in and out. Amounts are in cents, so <code className="font-mono text-gold">250000</code> is KES 2,500.00.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/docs/quickstart/" className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] bg-gold px-5 text-[14px] font-medium text-night hover:brightness-95">Start the quickstart <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link href="/docs/reference/collections/" className="inline-flex min-h-11 items-center rounded-[var(--pd-radius-sm)] border border-ivory/30 px-5 text-[14px] font-medium hover:border-ivory">API reference</Link>
              </div>
            </div>
            <div className="min-w-0 self-center">
              <p className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-ivory/70"><span className="font-mono">POST /v1/collections</span><Link href="/docs/reference/collections/#create-collection" className="underline">Try it, simulated</Link></p>
              <RequestCode req={reqOf(e)} />
            </div>
          </div>
        </section>

        {PROPOSED && (
          <p className="mt-4 flex items-start gap-2 rounded-[var(--pd-radius-sm)] border-l-4 border-[var(--pd-warn)] bg-warn-bg p-3 text-[14px]"><AlertTriangle size={17} aria-hidden="true" className="mt-0.5 shrink-0" /><span><strong>Proposed.</strong> The endpoints and the webhook scheme here are a proposal until the backend matches them. Nothing on this site says Tefo is live.</span></p>
        )}

        <section aria-labelledby="paths-h" className="mt-10">
          <h2 id="paths-h" className="pd-h2">Start with the job you have</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PATHS.map((c) => (
              <li key={c.href}><Link href={c.href} className="group flex h-full flex-col rounded-[var(--pd-radius-md)] border border-edge bg-surface p-5 hover:border-fg">
                <c.icon size={22} aria-hidden="true" className="text-accent-text" />
                <h3 className="mt-3 text-[16px] font-medium">{c.t}</h3>
                <p className="mt-1 flex-1 text-[14px] text-fg-muted">{c.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">Open <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" /></span>
              </Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tools-h" className="mt-10 grid gap-3 rounded-[var(--pd-radius-md)] border border-edge bg-sunken p-5 sm:grid-cols-3">
          <h2 id="tools-h" className="pd-vh">Tools</h2>
          <Link href="/docs/downloads/" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><Download size={18} aria-hidden="true" /><span><strong className="block font-medium">OpenAPI and Postman</strong><span className="text-fg-muted">Import the API in one click.</span></span></Link>
          <Link href="/docs/changelog/" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><BookOpen size={18} aria-hidden="true" /><span><strong className="block font-medium">Changelog and versioning</strong><span className="text-fg-muted">Current version {API_VERSION}.</span></span></Link>
          <a href="/llms.txt" className="flex min-h-11 items-center gap-3 text-[14px] hover:underline"><FileCode2 size={18} aria-hidden="true" /><span><strong className="block font-medium">For AI tools</strong><span className="text-fg-muted">llms.txt and a Markdown page for every page.</span></span></a>
        </section>
      </div>
    </SiteShell>
  );
}
