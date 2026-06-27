import { redirect } from "next/navigation";

// The entry point. Phase 2 reads the session here and routes by role; until
// then it sends everyone to sign in.
export default function Home() {
  redirect("/sign-in");
}
