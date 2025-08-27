import { redirect } from "next/navigation";
import { getSavedRegion } from "@/lib/localStorage";

export default function Home() {
  const savedRegion = getSavedRegion();
  redirect(`/${savedRegion}`);
}
