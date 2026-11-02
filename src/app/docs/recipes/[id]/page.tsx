import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/page-frame";
import { WalkthroughView } from "@/components/walkthrough";
import { RECIPES, recipeById } from "@/content/walkthroughs";
import { pageBySlug } from "@/lib/docs";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => RECIPES.map((r) => ({ id: r.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = pageBySlug(`recipes/${(await params).id}`);
  return p ? pageMeta(p) : {};
}

export default async function Recipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = recipeById(id);
  const page = pageBySlug(`recipes/${id}`);
  if (!w || !page) notFound();
  return <PageFrame page={page}><WalkthroughView w={w} storageKey={`recipe-${id}`} /></PageFrame>;
}
