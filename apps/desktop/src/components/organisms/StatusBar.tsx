import { Coins } from "lucide-react";
import type { RunnerCreditBalance } from "../../../shared/runner-types";

type StatusBarProps = {
    creditBalance?: RunnerCreditBalance | null;
};

export function StatusBar({ creditBalance }: StatusBarProps) {
    const hasBalance = !!creditBalance;
    const balance = creditBalance?.balance ?? 0;
    const isBlocked = hasBalance && balance <= 0;

    return (
        <footer className={`credit-bar${isBlocked ? " credit-bar--empty" : ""}`}>
            <span className="credit-bar__icon">
                <Coins size={16} />
            </span>
            <span className="credit-bar__label">Créditos disponíveis</span>
            {/* key força o replay da animação de "tick" a cada mudança de saldo */}
            <span className="credit-bar__value" key={balance}>
                {hasBalance ? balance.toLocaleString("pt-BR") : "—"}
            </span>
            {creditBalance?.plan ? (
                <span className="credit-bar__plan">{creditBalance.plan}</span>
            ) : null}
        </footer>
    );
}
