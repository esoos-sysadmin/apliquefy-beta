import { SignIn } from "@clerk/nextjs";

export default async function Login() { 
    return (
        <div>
            <SignIn/>
        </div>
    )
}