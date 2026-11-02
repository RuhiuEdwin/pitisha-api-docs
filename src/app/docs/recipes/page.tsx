import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { PageFrame } from "@/components/page-frame";
import { RECIPES } from "@/content/walkthroughs";
import { pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";

const page = pageBySlug("recipes")!;
export const metadata: Metadata = pageMeta(page);

export default function Recipes() {
  return (
    <PageFrame page={page}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {RECIPES.map((r) => (
          <li key={r.id}>
            <Link href={`/docs/recipes/${r.id}/`} className="group flex h-full flex-col rounded-[var(--pd-radius-md)] border border-edge bg-surface p-5 hover:border-fg">
              <h2 className="text-[17px] font-medium">{r.title}</h2>
              <p className="mt-1 flex-1 text-[14px] text-fg-muted">{r.summary}</p>
              <p className="mt-4 flex items-center gap-4 text-[13px] text-fg-muted"><span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden="true" />{r.minutes} min</span><span>{r.steps.length} steps</span><span className="ml-auto inline-flex items-center gap-1 font-medium text-fg">Open <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" /></span></p>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
