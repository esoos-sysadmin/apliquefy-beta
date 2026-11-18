import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

type Props = { jobTitle: string | null; companyName: string | null; url: string };

// Fallback do push (§6.5): a candidatura na nuvem caiu num captcha/código e espera o usuário.
export function NeedsUser({ jobTitle, companyName, url }: Props) {
    const vaga = `${jobTitle ?? "uma vaga"}${companyName ? ` na ${companyName}` : ""}`;
    return (
        <Html lang="pt-BR">
            <Head />
            <Preview>{`Sua candidatura para ${vaga} precisa de você`}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Section style={{ padding: "24px 32px" }}>
                        <Heading style={h1}>Sua candidatura precisa de você</Heading>
                        <Text style={text}>
                            O site da candidatura para <strong>{vaga}</strong> pediu uma verificação que o robô não resolve
                            (captcha ou código). Abra o link, resolva em poucos toques e o envio termina sozinho.
                        </Text>
                        <Button style={button} href={url}>
                            Concluir candidatura
                        </Button>
                        <Text style={muted}>O prazo é curto (cerca de 10 minutos). Se vencer, nenhum crédito é cobrado.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const body: React.CSSProperties = {
    backgroundColor: "#f4f4f5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: "24px 0",
};
const container: React.CSSProperties = {
    backgroundColor: "#ffffff", borderRadius: 12, maxWidth: 520, margin: "0 auto", border: "1px solid #e4e4e7",
};
const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 8px" };
const text: React.CSSProperties = { fontSize: 15, lineHeight: "24px", color: "#3f3f46", margin: "0 0 16px" };
const button: React.CSSProperties = {
    backgroundColor: "#7A3BFF", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600,
    textDecoration: "none", display: "inline-block", padding: "12px 24px", margin: "8px 0 16px",
};
const muted: React.CSSProperties = { fontSize: 13, lineHeight: "20px", color: "#71717a", margin: 0 };
