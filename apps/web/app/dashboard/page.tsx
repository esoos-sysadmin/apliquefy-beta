import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {

    const { isAuthenticated } = await auth()

    if (!isAuthenticated) {
        return redirect("/login")
    }

    const user = await currentUser()

    console.log(user)

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}