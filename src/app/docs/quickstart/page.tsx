import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { WalkthroughView } from "@/components/walkthrough";
import { QUICKSTART } from "@/content/walkthroughs";
import { pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";

const page = pageBySlug("quickstart")!;
export const metadata: Metadata = pageMeta(page);

export default function Quickstart() {
  return <PageFrame page={page}><WalkthroughView w={QUICKSTART} storageKey="quickstart" /></PageFrame>;
}
