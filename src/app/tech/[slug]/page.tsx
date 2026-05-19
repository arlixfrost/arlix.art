import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechDetailLayout } from "@/components/tech/TechDetailLayout";
import { getTechSection, techSections } from "@/lib/tech-sections";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return techSections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = getTechSection(slug);
  if (!section) return { title: "Tech" };
  return { title: `${section.detailTitle} · Tech` };
}

export default async function TechDetailPage({ params }: Props) {
  const { slug } = await params;
  const section = getTechSection(slug);
  if (!section) notFound();

  return <TechDetailLayout section={section} />;
}
