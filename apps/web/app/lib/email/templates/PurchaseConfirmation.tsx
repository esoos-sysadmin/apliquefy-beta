import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

type Props = {
    name?: string;
    productName: string;
    credits: number;
    appUrl: string;
};

const BLUE = "#3b82f6";

export function PurchaseConfirmation({ name, productName, credits, appUrl }: Props) {
    const greeting = name ? `Olá, ${name}!` : "Olá!";

    return (
        <Html lang="pt-BR">
            <Head />
            <Preview>{`Compra confirmada: ${productName} — ${credits} créditos liberados`}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Section style={header}>
                        <table cellPadding={0} cellSpacing={0} role="presentation">
                            <tbody>
                                <tr>
                                    <td style={logoBox}>A</td>
                                    <td style={{ paddingLeft: 10 }}>
                                        <Text style={brandName}>Apliquefy</Text>
                                        <Text style={brandTag}>Local-First Agent</Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>

                    <Section style={{ padding: "0 32px" }}>
                        <Heading style={h1}>Compra confirmada 🎉</Heading>
                        <Text style={text}>{greeting}</Text>
                        <Text style={text}>
                            Recebemos seu pagamento de <strong>{productName}</strong>. Seus{" "}
                            <strong>{credits} créditos</strong> já estão disponíveis na sua conta e prontos
                            para automatizar suas candidaturas.
                        </Text>

                        <Button style={button} href={`${appUrl}/relatorios`}>
                            Ir para o painel
                        </Button>

                        <Hr style={hr} />
                        <Text style={muted}>
                            Se você não reconhece esta compra, responda este email que a gente resolve.
                        </Text>
                    </Section>

                    <Section style={{ padding: "0 32px" }}>
                        <Text style={footer}>Apliquefy · automação de candidaturas a vagas</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export default PurchaseConfirmation;

const body: React.CSSProperties = {
    backgroundColor: "#f4f4f5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "24px 0",
};

const container: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    maxWidth: 520,
    margin: "0 auto",
    overflow: "hidden",
    border: "1px solid #e4e4e7",
};

const header: React.CSSProperties = {
    padding: "24px 32px 8px",
};

const logoBox: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: BLUE,
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: 800,
    fontSize: 16,
    color: "#fff",
};

const brandName: React.CSSProperties = { margin: 0, fontWeight: 700, fontSize: 14, color: "#111" };
const brandTag: React.CSSProperties = { margin: 0, fontSize: 11, color: "#71717a" };

const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "#111", margin: "16px 0 8px" };
const text: React.CSSProperties = { fontSize: 15, lineHeight: "24px", color: "#3f3f46", margin: "0 0 16px" };

const button: React.CSSProperties = {
    backgroundColor: BLUE,
    borderRadius: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    padding: "12px 24px",
    margin: "8px 0 16px",
};

const hr: React.CSSProperties = { borderColor: "#e4e4e7", margin: "24px 0 16px" };
const muted: React.CSSProperties = { fontSize: 13, lineHeight: "20px", color: "#71717a", margin: 0 };
const footer: React.CSSProperties = { fontSize: 12, color: "#a1a1aa", margin: "24px 0", textAlign: "center" };
