import { SignIn } from "@clerk/nextjs";

export default async function Login() { 
    return (
        <div className="login flex justify-center mt-4">
            <SignIn/>
        </div>
    )
}