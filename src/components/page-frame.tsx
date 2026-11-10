import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { PageHeader } from "tefo-design";
import { Helpful } from "@/components/helpful";
import { MobileToc, Toc } from "@/components/toc";
import { API_VERSION } from "@/content/config";
import { crumbs, editUrl, neighbours, tocFor, type DocPage } from "@/lib/docs";

export function PageFrame({ page, children }: { page: DocPage; children: React.ReactNode }) {
  const toc = tocFor(page);
  const { prev, next } = neighbours(page);
  const trail = crumbs(page);
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-10">
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="mb-3 text-[13px] text-fg-muted">
          <ol className="flex flex-wrap items-center gap-x-1.5">
            {trail.map((c, i) => (
              <Fragment key={c.label + i}>
                {i > 0 && <li aria-hidden="true">/</li>}
                <li>{c.href && i < trail.length - 1 ? <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-fg hover:underline">{c.label}</Link> : <span aria-current={i === trail.length - 1 ? "page" : undefined} className={i === trail.length - 1 ? "text-fg" : ""}>{c.label}</span>}</li>
              </Fragment>
            ))}
          </ol>
        </nav>
        <PageHeader title={page.title} sub={page.description} className="!mb-6" />
        <MobileToc items={toc} />
        <div>{children}</div>
        <Helpful slug={page.slug.replace("/", "-")} editUrl={editUrl(page)} />
        <nav aria-label="Previous and next" className="mt-8 grid gap-3 text-[14px] sm:grid-cols-2">
          <div>{prev && <Link href={prev.href} className="flex min-h-11 items-center gap-3 rounded-[var(--pd-radius-sm)] border border-edge p-4 hover:shadow-pd-md"><ChevronLeft size={16} aria-hidden="true" /><span><span className="block text-xs text-fg-muted">Previous</span>{prev.title}</span></Link>}</div>
          <div>{next && <Link href={next.href} className="flex min-h-11 items-center justify-end gap-3 rounded-[var(--pd-radius-sm)] border border-edge p-4 text-right hover:shadow-pd-md"><span><span className="block text-xs text-fg-muted">Next</span>{next.title}</span><ChevronRight size={16} aria-hidden="true" /></Link>}</div>
        </nav>
        <p className="mt-6 text-[12px] text-fg-muted">API version {API_VERSION}. <Link href={`${page.href}index.md`} className="underline">View as Markdown</Link></p>
      </article>
      <aside aria-label="On this page" className="hidden xl:block"><div className="sticky top-24"><Toc items={toc} /></div></aside>
    </div>
  );
}
