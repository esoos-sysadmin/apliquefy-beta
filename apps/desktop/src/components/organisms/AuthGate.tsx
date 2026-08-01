import { LockKeyhole, ShieldCheck } from "lucide-react";
import { GradientButton } from "../atoms/GradientButton";

type AuthGateProps = {
    isAuthenticating: boolean;
    onSignIn: () => void;
};

export function AuthGate({ isAuthenticating, onSignIn }: AuthGateProps) {
    return (
        <section className="auth-gate">
            <div className="auth-gate__hero">
                <div className="auth-gate__icon">
                    <ShieldCheck size={28} />
                </div>
            </div>

            <div className="auth-gate__content">
                <h2 className="auth-gate__title">Entre para continuar</h2>
                <p className="auth-gate__description">
                    O runner do desktop fica bloqueado até você autenticar sua conta Apliquefy com o Clerk.
                </p>
            </div>

            <GradientButton
                fullWidth
                onClick={onSignIn}
                disabled={isAuthenticating}
            >
                <LockKeyhole size={16} />
                {isAuthenticating ? "Abrindo login..." : "Entrar com o Clerk"}
            </GradientButton>
        </section>
    );
}
