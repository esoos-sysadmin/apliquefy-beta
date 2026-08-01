export const metadata = {
    title: "Política de Privacidade | Apliquefy",
    description: "Política de Privacidade da plataforma Apliquefy",
}

export default function PoliticaDePrivacidadePage() {
    return (
        <div className="min-h-screen text-gray-300 py-16 px-4">
            <article className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-white">Política de Privacidade</h1>
                <p className="text-sm text-gray-500">Última atualização: 13 de abril de 2026</p>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Introdução</h2>
                    <p>
                        A Apliquefy (&quot;nós&quot;, &quot;nosso&quot; ou &quot;plataforma&quot;) é uma plataforma de automação de candidaturas
                        a vagas de emprego que opera por meio de um aplicativo web e um aplicativo desktop. Esta Política de
                        Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. Dados que Coletamos</h2>
                    <p>Coletamos as seguintes categorias de dados:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong className="text-white">Dados de cadastro e autenticação:</strong> nome, e-mail e dados de
                            autenticação gerenciados pelo nosso provedor de identidade (Clerk).
                        </li>
                        <li>
                            <strong className="text-white">Dados de perfil profissional:</strong> currículo, experiências,
                            habilidades, localização (estado) e preferências de busca de vagas que você fornece para configurar
                            suas campanhas de candidatura.
                        </li>
                        <li>
                            <strong className="text-white">Credenciais de plataformas terceiras:</strong> dados de login do
                            LinkedIn e/ou InfoJobs, armazenados localmente no aplicativo desktop para execução das candidaturas
                            automatizadas. Esses dados não são transmitidos aos nossos servidores.
                        </li>
                        <li>
                            <strong className="text-white">Dados de uso e candidaturas:</strong> histórico de candidaturas
                            realizadas, status de cada aplicação (aplicada, falha, ignorada) e métricas de campanhas.
                        </li>
                        <li>
                            <strong className="text-white">Dados de pagamento:</strong> informações de cobrança processadas
                            pelo Stripe. Não armazenamos dados de cartão de crédito em nossos servidores.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Como Usamos seus Dados</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Executar candidaturas automatizadas em plataformas de emprego (LinkedIn, InfoJobs) conforme suas campanhas configuradas.</li>
                        <li>Gerenciar sua conta, assinatura e créditos.</li>
                        <li>Exibir o histórico e status das suas candidaturas.</li>
                        <li>Melhorar a plataforma e corrigir problemas técnicos.</li>
                        <li>Enviar comunicações relacionadas ao serviço (ex.: confirmações de pagamento, alertas de créditos).</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Armazenamento e Segurança</h2>
                    <p>
                        Seus dados são armazenados em servidores seguros com banco de dados PostgreSQL. As credenciais de
                        plataformas terceiras (LinkedIn, InfoJobs) são armazenadas exclusivamente no aplicativo desktop, na
                        máquina local do usuário, e não são enviadas para nossos servidores.
                    </p>
                    <p>
                        Utilizamos provedores confiáveis para autenticação (Clerk) e pagamentos (Stripe), que possuem suas
                        próprias políticas de segurança e conformidade.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">5. Compartilhamento de Dados</h2>
                    <p>Não vendemos seus dados pessoais. Compartilhamos informações apenas com:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong className="text-white">Clerk:</strong> para autenticação e gerenciamento de usuários.</li>
                        <li><strong className="text-white">Stripe:</strong> para processamento de pagamentos e assinaturas.</li>
                        <li><strong className="text-white">Plataformas de emprego:</strong> seus dados de perfil são enviados diretamente do aplicativo desktop para LinkedIn e/ou InfoJobs durante o processo de candidatura.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">6. Seus Direitos (LGPD)</h2>
                    <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Acessar seus dados pessoais.</li>
                        <li>Corrigir dados incompletos ou desatualizados.</li>
                        <li>Solicitar a exclusão dos seus dados.</li>
                        <li>Revogar o consentimento para o uso dos seus dados.</li>
                        <li>Solicitar a portabilidade dos seus dados.</li>
                    </ul>
                    <p>
                        Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail:{" "}
                        <a href="mailto:contato@apliquefy.com" className="text-blue-400 hover:underline">contato@apliquefy.com</a>.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">7. Cookies</h2>
                    <p>
                        Utilizamos cookies essenciais para manter sua sessão de autenticação e preferências. Não utilizamos
                        cookies de rastreamento ou publicidade.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">8. Alterações nesta Política</h2>
                    <p>
                        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças
                        significativas por meio da plataforma ou por e-mail. O uso continuado do serviço após alterações
                        constitui aceitação da política atualizada.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">9. Contato</h2>
                    <p>
                        Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail:{" "}
                        <a href="mailto:contato@apliquefy.com" className="text-blue-400 hover:underline">contato@apliquefy.com</a>.
                    </p>
                </section>
            </article>
        </div>
    )
}
