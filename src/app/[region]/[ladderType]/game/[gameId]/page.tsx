import { Metadata } from "next";
import MatchPageClient from "@/components/MatchPageClient";
import { LadderType } from "@/lib/api";

export async function generateStaticParams() {
  // Return empty array to handle all routes client-side
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string; region: string; ladderType: string }>;
}): Promise<Metadata> {
  const { gameId, region, ladderType } = await params;

  // Validate ladder type
  const validLadderType: LadderType = ladderType === "2v2-random" ? "2v2-random" : "1v1";

  const title = `Match ${gameId.substring(0, 8)}... - Chrono Divide Replays`;
  const description = `View detailed match statistics, combat analytics, and economy graphs for this ${validLadderType} ranked match on ${region}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ gameId: string; region: string; ladderType: string }>;
}) {
  const { gameId, region, ladderType } = await params;

  // Validate ladder type
  const validLadderType: LadderType = ladderType === "2v2-random" ? "2v2-random" : "1v1";

  return (
    <MatchPageClient 
      gameId={gameId} 
      region={region} 
      ladderType={validLadderType} 
    />
  );
}
