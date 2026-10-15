import { Download, Globe, RefreshCw } from "lucide-react";
import { GradientButton } from "../atoms/GradientButton";

const CHROME_DOWNLOAD_URL = "https://www.google.com/chrome/";

type ChromeGateProps = {
    isChecking: boolean;
    onRecheck: () => void;
};

// Mesmo layout do AuthGate: bloqueia o runner até o Chrome estar instalado.
export function ChromeGate({ isChecking, onRecheck }: ChromeGateProps) {
    return (
        <section className="auth-gate">
            <div className="auth-gate__hero">
                <div className="auth-gate__icon">
                    <Globe size={28} />
                </div>
            </div>

            <div className="auth-gate__content">
                <h2 className="auth-gate__title">Instale o Google Chrome</h2>
                <p className="auth-gate__description">
                    O Apliquefy usa o Google Chrome para conectar suas contas e enviar as candidaturas.
                    Instale o Chrome e depois clique em "Já instalei".
                </p>
            </div>

            {/* window.open cai no setWindowOpenHandler e abre no navegador padrão. */}
            <GradientButton fullWidth onClick={() => window.open(CHROME_DOWNLOAD_URL)}>
                <Download size={16} />
                Baixar o Google Chrome
            </GradientButton>
            <GradientButton fullWidth onClick={onRecheck} disabled={isChecking}>
                <RefreshCw size={16} />
                {isChecking ? "Verificando..." : "Já instalei, verificar de novo"}
            </GradientButton>
        </section>
    );
}
