import AuditResults from "@/components/AuditResults";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // In a real app, fetch data by ID
  const savings = 640; // Mock savings
  
  return {
    title: `AI Spend Audit - Save $${savings}/mo`,
    description: `Discover how to optimize your AI stack and save up to $${savings * 12}/year.`,
    openGraph: {
      title: `AI Spend Audit - Save $${savings}/mo`,
      description: `Discover how to optimize your AI stack and save up to $${savings * 12}/year.`,
      images: [
        {
          url: `/api/og?savings=${savings}`, // We can create this API route later
          width: 1200,
          height: 630,
          alt: `AI Spend Audit Results`,
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AuditResults id={resolvedParams.id} />;
}
