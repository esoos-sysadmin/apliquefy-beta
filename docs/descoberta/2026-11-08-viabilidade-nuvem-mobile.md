# Viabilidade: candidaturas pela nuvem para o Apliquefy funcionar no celular

Fase Descoberta · Marco MA (Escopo decidido) · 08/11/2026
Versão publicada: https://claude.ai/artifact/T5a3NY5rEjpFPhNpjzn44L

## Veredito

Viável para ATS com formulário público. O envio roda num navegador na nuvem e o celular vira só o painel web.

- **Entra na nuvem:** descoberta de vagas do LinkedIn pelo Apify, sem login. Greenhouse, Lever e Ashby (APIs públicas oficiais e formulário sem conta). Workable, Recruitee, Breezy, Teamtailor e Quickin também abriram formulário sem conta no teste de hoje. A descoberta de vagas e o matching também entram.
- **Fica no desktop:** LinkedIn Easy Apply, que exige a sessão do usuário e é proibido pelos termos, e Gupy, Sólides e Workday, que exigem conta do candidato. O SmartRecruiters bloqueou o navegador automatizado.

## Como funcionaria

1. **Descoberta.** As vagas vêm das APIs públicas dos ATS. O Greenhouse devolve até as perguntas do formulário (`?questions=true`). As vagas do LinkedIn vêm de um scraper do Apify, que devolve o link externo e o ATS de cada vaga. Google Jobs fica como fonte extra. Reaproveita `candidata/sources.py`.
2. **Matching.** Descarta a vaga com requisito eliminatório antes de gastar crédito. Reaproveita `apps/robots/.../fit_gate.py`.
3. **Fila e worker.** A web publica o job no RabbitMQ. Um worker no Railway abre um navegador gerenciado (Browserbase, Steel ou Hyperbrowser) com proxy residencial, preenche com LLM e anexa o PDF. Reaproveita `candidata/forms.py` e `apply_agent.py`. Corresponde às tarefas 4 e 5.
4. **Captcha ou verificação visível.** A candidatura pausa e o usuário recebe uma notificação. Ele conclui pela tela ao vivo do navegador remoto. O sistema nunca contorna o captcha. Corresponde à tarefa 11.
5. **Confirmação.** O worker detecta a tela de sucesso, grava o status e debita o crédito. A web responsiva, como PWA, cuida das notificações. Corresponde à tarefa 13.

## Onde entra o Apify

O Apify é a fonte de vagas, não o envio. Um scraper pronto lê as vagas do LinkedIn sem login e, para cada vaga, diz se é Easy Apply ou externa, qual é o link de candidatura e qual ATS a empresa usa. Com isso cada vaga já cai no canal certo:

| O Apify diz que a vaga é… | Canal |
|---|---|
| Externa, em Greenhouse, Lever, Ashby, Workable… | Nuvem: o worker envia, e o usuário acompanha pelo celular |
| Easy Apply do LinkedIn | Desktop: precisa da sessão do usuário |
| Externa, em Gupy, Sólides, Workday | Desktop ou lista "envie você mesmo" |

- **Qual ator:** `harvestapi/linkedin-job-search`, que devolve o ATS de cada vaga (`applicantTrackingSystem`), ou `bebity/linkedin-jobs-scraper`, que separa Easy Apply de externa (`applyType`). Os dois cobram ~US$ 1 por 1.000 vagas e funcionam sem cookies.
- **Greenhouse no Apify não vale a pena:** os atores só repassam a API oficial, que é grátis. A exceção é rodar uma vez o `johnvc/greenhouse-job-board-api` para obter a lista de 4.400 empresas.
- **Integração:** uma chamada à API do Apify por dia, no coletor da tarefa 6; o resultado entra na tabela `job_postings` da tarefa 4.
- **Falta validar:** os campos vêm das páginas dos atores, e nenhum foi rodado ainda. O primeiro passo é rodar 1.000 vagas BR (≈ US$ 1, cabe nos US$ 5 grátis do mês).
- **Outra opção, não avaliada:** o Apify também executa Playwright com proxy residencial e poderia hospedar o próprio worker de envio no lugar do Browserbase.

## Evidência (testado em 08/11/2026)

| Fonte | Lê vagas sem login | Envia sem conta | Proteção |
|---|---|---|---|
| Greenhouse | Sim, API oficial com perguntas | Sim, pelo formulário. A API de envio exige chave da empresa | reCAPTCHA Enterprise invisível; algumas empresas pedem código por e-mail |
| Lever | Sim, API oficial | Sim, pelo formulário | hCaptcha |
| Ashby | Sim, API oficial | Sim, pelo formulário | reCAPTCHA |
| Workable | Sim, API pública | Sim, 12 campos e anexo | Cloudflare Turnstile |
| Recruitee | Sim, API pública | Sim | nenhum encontrado |
| Breezy | Sim, JSON público | Sim, com anexo | nenhum encontrado |
| Teamtailor | Sim, RSS público | Sim, com anexo | nenhum encontrado |
| Quickin (BR) | Sim, página pública | Sim, 15 campos e anexo | nenhum encontrado |
| PandaPé (BR) | Sim, página pública | Parcial: pede o e-mail primeiro; o passo seguinte não foi testado | nenhum encontrado |
| SmartRecruiters | Sim, API pública | Bloqueado | "Acesso temporariamente restrito" para o navegador automatizado |
| Gupy, Sólides (BR) | Sim, página pública | Não, o botão leva ao login | login |
| Workday | Sim | Não, exige conta | login |
| LinkedIn sem login (script próprio) | Título, empresa e descrição | Não | O link externo fica atrás do login; HTTP 429 após ~120 requisições |
| LinkedIn via Apify | Sim, sem cookies, ~US$ 1 por 1.000 vagas | Não se aplica | Devolve o link externo, Easy Apply ou externo e, no harvestapi, `applicantTrackingSystem`. Falta testar |
| Google Jobs | Só por terceiros (SerpApi, DataForSEO) | Não se aplica | Devolve o link direto de candidatura; pago por busca |

Atores de Greenhouse no Apify (plainrows, johnvc, khadinakbar, vital_tuxedo) só repassam a API oficial, que é grátis, custam de US$ 0,80 a 10 por 1.000 vagas e têm até 34 usuários. Não compensa. A exceção é o `johnvc/greenhouse-job-board-api` no modo `companiesOnly`, que lista mais de 4.400 boards do Greenhouse; vale uma execução só, para montar a lista de empresas, que depois é lida de graça pela API oficial. As URLs do Greenhouse vindas do scraper do LinkedIn também alimentam essa lista.

A proteção foi verificada em vagas reais: GitLab e Stripe no Greenhouse, Palantir no Lever e Ramp no Ashby. Os demais formulários foram abertos num Chrome automatizado (Playwright), sem preencher nem enviar. "Nenhum encontrado" significa que a página não fez nenhuma requisição de captcha; isso só se confirma num envio real. Não foi possível testar InHire, Abler e Personio por falta de vaga pública.

## Como o AI Apply faz

Ele não documenta o mecanismo, mas o help center dá três pistas:

- **Roda na nuvem.** A página do produto diz que a busca "não para quando você sai", e o envio começa assim que os critérios são salvos.
- **Cria uma caixa de e-mail para o usuário.** Ele recebe acesso a um mailbox, guardado por 3 meses após o último pagamento. Isso combina com receber o código de verificação que o Greenhouse manda por e-mail e com criar conta em ATS que exigem cadastro.
- **Pula o que não consegue.** "Alguns sistemas nós ainda não conseguimos controlar automaticamente"; essas vagas são puladas sem cobrar crédito.

Preço: US$ 49 por 100 candidaturas (≈ US$ 0,49 cada), 1 crédito por envio bem-sucedido. Modos automático, híbrido (envia sozinho com nota de aderência 75+) e revisão. Não há app mobile nem menção a captcha. Concorrentes afirmam, sem prova, que ele usa automação de navegador e que o Workday e o Greenhouse rejeitam parte dos envios em silêncio.

## Captcha: regra do produto

O sistema não resolve nem contorna captcha, e não usa serviços como 2Captcha, que violam os termos dos ATS e do Google. Quase todos os captchas encontrados são invisíveis (reCAPTCHA no Greenhouse, Turnstile no Workable, hCaptcha no Lever): eles dão uma nota ao navegador e só mostram desafio quando a nota é baixa. Um Chrome real em ritmo humano costuma passar sem desafio, como o app desktop já faz hoje. Quando aparecer um desafio visível, a própria pessoa resolve pelo celular. Sites que barram o robô antes do formulário, como o SmartRecruiters, ficam fora.

## Custo por candidatura na nuvem

| Item | US$ |
|---|---|
| Navegador gerenciado (~3 min a US$ 0,10/h) | 0,005 |
| Proxy residencial (2–4 MB a US$ 4–12/GB) | 0,01–0,05 |
| LLM (gpt-4.1-mini pelo proxy atual) | 0,002–0,01 |
| **Total** | **0,02–0,06** (≈ R$ 0,11–0,35, com US$ 1 = R$ 5,50) |
| Fixo: navegadores + worker e fila | ~50–130/mês |
| Descoberta no Apify (~30 mil vagas/mês) | ~30/mês |

Hoje um crédito rende R$ 0,05 (Enterprise) a R$ 0,10 (Starter). Na nuvem, 1 candidatura = 1 crédito dá prejuízo. A proposta é cobrar 3 a 5 créditos por candidatura na nuvem ou criar um plano "Celular" à parte. Para comparar, o AI Apply cobra ≈ R$ 2,70 por candidatura. Os preços vêm de sites de comparação e devem ser confirmados com cada fornecedor.

## Riscos

- **Alto: captcha e anti-bot.** O reCAPTCHA Enterprise dá nota baixa para IP de datacenter. Mitigação: proxy residencial, Chrome real em ritmo humano, o usuário conclui pela tela ao vivo e o crédito é devolvido em caso de falha.
- **Alto: cobertura no Brasil.** Grande parte das vagas brasileiras que não são de tecnologia passa pela Gupy e similares, que exigem conta. É uma hipótese que o histograma vai medir. Mitigação: lançar o celular para o público tech e remoto e manter o desktop para LinkedIn e Gupy.
- **Médio: termos de uso.** O LinkedIn processou a ProAPIs em outubro de 2025. O Apify tira a coleta da nossa infraestrutura, mas a vaga continua vindo de scraping, e o fornecedor pode sair do ar como a Proxycurl saiu. Mitigação: as APIs dos ATS ficam como fonte principal, o Easy Apply só no desktop, e os termos dos 3 ATS precisam ser lidos (tarefa 3).
- **Médio: margem.** O custo unitário é 2 a 7 vezes a receita de um crédito. Mitigação: reprecificar.
- **Médio: spam e reputação.** Mitigação: matching obrigatório, limite diário e respostas só com dados do currículo (regra R10).
- **Médio: LGPD.** Mitigação: não guardar senhas de terceiros, apagar a sessão do navegador ao fim de cada envio e registrar o consentimento.

## Decisão proposta

- **3 ATS alvo:** Greenhouse, Lever e Ashby. Um ATS brasileiro sem conta entra só se o histograma justificar (tarefa 10, primeiro corte).
- **Trocar a tarefa 1 pelo Apify:** rodar 1.000 vagas BR no `harvestapi/linkedin-job-search` (≈ US$ 1). Isso confirma se o link externo vem preenchido e gera o histograma da tarefa 2.
- **Teste decisivo (2 dias):** 10 candidaturas reais no Greenhouse a partir de um worker na nuvem, com e sem proxy residencial. Acima de 80% de sucesso, seguimos com o plano. Abaixo de 50%, o celular passa a só agendar e o envio continua no desktop.
- **Preço:** definir quantos créditos custa uma candidatura na nuvem antes do M0 (25/11).

## Fontes

- Greenhouse, reCAPTCHA e verificação por e-mail: https://support.greenhouse.io/hc/en-us/articles/115005448066
- Greenhouse Job Board API: https://dev.to/superface/get-started-with-greenhouse-apis-overview-and-authentication-2ip0
- Browserbase, preços: https://www.browserbase.com/pricing · comparativo: https://www.tinyfish.ai/blog/browserbase-pricing
- LinkedIn processa a ProAPIs: https://securityaffairs.com/183001/security/linkedin-sues-proapis-for-15k-month-linkedin-data-scraping-scheme.html
- AI Apply: https://support.aiapply.co/en/articles/14216708-how-does-auto-apply-works · https://aiapply.co/auto-apply · https://aiapply.co/is-aiapply-legit
- Apify: https://apify.com/harvestapi/linkedin-job-search · https://apify.com/bebity/linkedin-jobs-scraper · https://apify.com/curious_coder/linkedin-jobs-scraper
- Google Jobs: https://serpapi.com/blog/how-to-scrape-google-jobs-results/ · https://dataforseo.com/pricing/serp/google-jobs-serp-api
