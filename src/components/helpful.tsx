"use client";

import { Check, PenLine, ThumbsDown, ThumbsUp } from "lucide-react";
import { useLocal } from "@/components/prefs";

/** "Was this helpful?" is saved on this device only. There is no feedback endpoint yet (see BACKEND-GAPS.md), and the control says so. */
export function Helpful({ slug, editUrl }: { slug: string; editUrl: string }) {
  const [vote, setVote] = useLocal<"yes" | "no" | null>(`tefo-docs-helpful-${slug}`, null);
  return (
    <section aria-label="Feedback" className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-edge pt-5 text-[14px]">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Was this helpful?">
        <span className="font-medium">Was this helpful?</span>
        {(["yes", "no"] as const).map((v) => (
          <button key={v} type="button" aria-pressed={vote === v} onClick={() => setVote(vote === v ? null : v)} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--pd-radius-sm)] border border-edge-strong px-4 hover:bg-sunken aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-canvas">
            {v === "yes" ? <ThumbsUp size={15} aria-hidden="true" /> : <ThumbsDown size={15} aria-hidden="true" />}{v === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
      <a href={editUrl} className="inline-flex min-h-11 items-center gap-2 text-fg-muted underline underline-offset-4 hover:text-fg"><PenLine size={15} aria-hidden="true" />Edit this page</a>
      <p role="status" className="basis-full text-[13px] text-fg-muted">
        {vote ? <span className="inline-flex items-center gap-1.5"><Check size={14} aria-hidden="true" />Thanks. Your answer is saved on this device only, because feedback is not collected yet. To tell us what to fix, use Edit this page.</span> : ""}
      </p>
    </section>
  );
}
