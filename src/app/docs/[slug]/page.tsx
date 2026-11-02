import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChangelogView } from "@/components/changelog-view";
import { ErrorExplorer } from "@/components/error-explorer";
import { explorerErrors } from "@/lib/errors";
import { GoLiveChecklist } from "@/components/go-live";
import { Markdown } from "@/components/markdown";
import { PageFrame } from "@/components/page-frame";
import { ProposedNote } from "@/components/callouts";
import { PROPOSED } from "@/content/config";
import { GUIDE_SLUGS, guideBody, pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDE_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = pageBySlug((await params).slug);
  return p ? pageMeta(p) : {};
}

export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();
  return (
    <PageFrame page={page}>
      {page.kind === "go-live" && <GoLiveChecklist />}
      {page.kind === "changelog" && <ChangelogView />}
      {page.kind === "guide" && (
        <>
          {slug === "webhooks" && PROPOSED && <ProposedNote what="The webhook signature scheme and the endpoints" />}
          <Markdown>{guideBody(slug)}</Markdown>
          {slug === "errors" && <ErrorExplorer errors={explorerErrors()} />}
          {slug === "webhooks" && <p className="mt-6 text-[15px]">See every event with a payload example, and check a signature in your browser, in the <Link href="/docs/webhook-events/" className="underline">event catalogue</Link>.</p>}
        </>
      )}
    </PageFrame>
  );
}
