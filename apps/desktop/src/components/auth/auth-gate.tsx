import { LockKeyhole, ShieldCheck } from "lucide-react";
import { GradientButton } from "../ui/gradient-button";

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
                <h2 className="auth-gate__title">Sign in to continue</h2>
                <p className="auth-gate__description">
                    The desktop runner is locked until you authenticate your Apliquefy account with Clerk.
                </p>
            </div>

            <GradientButton
                fullWidth
                onClick={onSignIn}
                disabled={isAuthenticating}
            >
                <LockKeyhole size={16} />
                {isAuthenticating ? "Opening sign in..." : "Sign in with Clerk"}
            </GradientButton>
        </section>
    );
}
