import { redirect } from "next/navigation";
import { getAuthSession } from "./lib/auth/server/clerk";

export default async function Home() {
  
  const { userId } = await getAuthSession();

  if (!userId) {
    redirect("/lp")
  } else {
    redirect("/relatorios")
  }
}
