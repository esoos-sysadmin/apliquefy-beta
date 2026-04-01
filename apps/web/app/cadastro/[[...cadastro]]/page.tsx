import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function Cadastro() {
    return (
        <div className="cadastro flex justify-center mt-4">
            <SignUp/>
        </div>
    )
}