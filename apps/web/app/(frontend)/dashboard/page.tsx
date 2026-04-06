import { redirect } from "next/navigation";
import { getAuthSession, getCurrentSessionUser } from "../../lib/auth/server/clerk";

export default async function Dashboard() {

    const { isAuthenticated } = await getAuthSession()

    if (!isAuthenticated) {
        return redirect("/login")
    }

    const user = await getCurrentSessionUser()

    console.log(user)

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}
