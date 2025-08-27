"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getSavedRegion } from "@/lib/localStorage";

export default function Home() {
  useEffect(() => {
    const savedRegion = getSavedRegion();
    redirect(`/${savedRegion}`);
  }, []);
}
