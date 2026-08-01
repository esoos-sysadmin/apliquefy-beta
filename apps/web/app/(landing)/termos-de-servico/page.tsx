export const metadata = {
    title: "Termos de Serviço | Apliquefy",
    description: "Termos de Serviço da plataforma Apliquefy",
}

export default function TermosDeServicoPage() {
    return (
        <div className="min-h-screen bg-[#0B111A] text-gray-300 py-16 px-4">
            <article className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-white">Termos de Serviço</h1>
                <p className="text-sm text-gray-500">Última atualização: 13 de abril de 2026</p>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Aceitação dos Termos</h2>
                    <p>
                        Ao acessar ou utilizar a plataforma Apliquefy (&quot;Serviço&quot;), você concorda em cumprir e estar
                        vinculado a estes Termos de Serviço. Se você não concordar com algum destes termos, não utilize o Serviço.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. Descrição do Serviço</h2>
                    <p>
                        A Apliquefy é uma plataforma de automação de candidaturas a vagas de emprego. O Serviço permite que
                        você configure campanhas de candidatura e utilize nosso aplicativo desktop para aplicar automaticamente
                        a vagas em plataformas como LinkedIn e InfoJobs, utilizando um sistema de créditos.
                    </p>
                    <p>O Serviço é composto por:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong className="text-white">Aplicativo Web:</strong> para gerenciamento de conta, campanhas, assinatura e histórico de candidaturas.</li>
                        <li><strong className="text-white">Aplicativo Desktop:</strong> para execução das candidaturas automatizadas diretamente na máquina do usuário.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Cadastro e Conta</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Você deve fornecer informações verdadeiras e atualizadas ao se cadastrar.</li>
                        <li>Você é responsável por manter a segurança da sua conta e senha.</li>
                        <li>Você é responsável por todas as atividades realizadas em sua conta.</li>
                        <li>Você deve ter pelo menos 18 anos para utilizar o Serviço.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Planos, Créditos e Pagamentos</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            O Serviço oferece planos de assinatura (Starter, Professional e Enterprise) com diferentes
                            quantidades de créditos mensais.
                        </li>
                        <li>Cada candidatura automatizada consome créditos da sua conta.</li>
                        <li>Pacotes de créditos adicionais podem ser adquiridos separadamente.</li>
                        <li>Os pagamentos são processados pelo Stripe. Ao fornecer seus dados de pagamento, você concorda com os termos do Stripe.</li>
                        <li>Assinaturas são renovadas automaticamente. Você pode cancelar a qualquer momento, mantendo o acesso até o final do período pago.</li>
                        <li>Créditos não utilizados não são acumulados entre períodos de assinatura, salvo créditos avulsos adquiridos separadamente.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">5. Uso Aceitável</h2>
                    <p>Ao utilizar o Serviço, você concorda em:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Utilizar a plataforma apenas para fins legítimos de busca de emprego.</li>
                        <li>Fornecer informações verdadeiras em seu perfil e candidaturas.</li>
                        <li>Respeitar os termos de uso das plataformas terceiras (LinkedIn, InfoJobs).</li>
                        <li>Não utilizar o Serviço para enviar spam ou candidaturas em massa indiscriminadas.</li>
                        <li>Não tentar burlar, explorar ou interferir no funcionamento da plataforma.</li>
                        <li>Não revender, sublicenciar ou compartilhar sua conta com terceiros.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">6. Credenciais de Plataformas Terceiras</h2>
                    <p>
                        Para realizar candidaturas automatizadas, você fornece suas credenciais de acesso ao LinkedIn e/ou
                        InfoJobs. Essas credenciais são armazenadas localmente no aplicativo desktop e utilizadas exclusivamente
                        para a execução das candidaturas. Você é o único responsável pelo uso das suas credenciais e pelo
                        cumprimento dos termos de uso dessas plataformas.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">7. Limitação de Responsabilidade</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            A Apliquefy não garante a contratação ou qualquer resultado específico decorrente do uso do Serviço.
                        </li>
                        <li>
                            Não nos responsabilizamos por restrições, suspensões ou banimentos impostos por plataformas
                            terceiras (LinkedIn, InfoJobs) em decorrência do uso de automação.
                        </li>
                        <li>
                            O Serviço é fornecido &quot;como está&quot;. Não garantimos disponibilidade ininterrupta ou
                            ausência de erros.
                        </li>
                        <li>
                            Não nos responsabilizamos por candidaturas incorretas, duplicadas ou não realizadas por falhas
                            técnicas.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">8. Propriedade Intelectual</h2>
                    <p>
                        Todo o conteúdo, código, design e funcionalidades da plataforma Apliquefy são de propriedade exclusiva
                        da Apliquefy. É proibida a reprodução, distribuição ou engenharia reversa de qualquer parte do Serviço
                        sem autorização prévia.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">9. Rescisão</h2>
                    <p>
                        Reservamo-nos o direito de suspender ou encerrar sua conta caso você viole estes Termos de Serviço.
                        Você pode encerrar sua conta a qualquer momento entrando em contato conosco. Em caso de encerramento,
                        créditos restantes não são reembolsáveis.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">10. Alterações nos Termos</h2>
                    <p>
                        Podemos modificar estes Termos de Serviço a qualquer momento. Notificaremos sobre mudanças
                        significativas por meio da plataforma ou por e-mail. O uso continuado do Serviço após as alterações
                        constitui aceitação dos termos atualizados.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">11. Legislação Aplicável</h2>
                    <p>
                        Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil. Qualquer disputa
                        será submetida ao foro da comarca do domicílio do usuário, conforme o Código de Defesa do Consumidor.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">12. Contato</h2>
                    <p>
                        Em caso de dúvidas sobre estes Termos de Serviço, entre em contato pelo e-mail:{" "}
                        <a href="mailto:contato@apliquefy.com" className="text-blue-400 hover:underline">contato@apliquefy.com</a>.
                    </p>
                </section>
            </article>
        </div>
    )
}
