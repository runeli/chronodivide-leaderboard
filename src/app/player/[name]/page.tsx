import PlayerPageClient from '@/components/PlayerPageClient';

export async function generateStaticParams() {
  // Return empty array to handle all routes client-side
  return [];
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <PlayerPageClient playerName={name} />;
}
