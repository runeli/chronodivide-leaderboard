"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSavedRegion } from "@/lib/localStorage";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedRegion = getSavedRegion();
    const query = searchParams.toString();
    router.replace(query ? `/${savedRegion}?${query}` : `/${savedRegion}`);
  }, [router, searchParams]);

  return null;
}
