import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the default region
  redirect("/am-eu");
}
