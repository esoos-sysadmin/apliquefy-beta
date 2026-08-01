# Apliquefy — Documentação de Negócios

> Documento de visão de produto e negócio. Descreve a proposta, o público, o
> modelo de monetização e o catálogo de funcionalidades da plataforma.
> Não contém detalhes de implementação técnica.

---

## 1. Visão geral

**Apliquefy** é uma plataforma de automação de candidaturas a vagas de emprego.
O usuário configura, uma única vez, quem ele é (currículo) e o que procura
(filtros de vaga, limites diários) — e a plataforma se candidata às vagas por
ele, automaticamente, nas principais plataformas de emprego do Brasil.

A proposta central: **eliminar o trabalho repetitivo de se candidatar a
dezenas de vagas por dia.** Em vez de o candidato abrir vaga por vaga,
preencher formulários e clicar em "candidatar-se" manualmente, o Apliquefy faz
isso em escala, respeitando os critérios definidos e um limite diário saudável.

### Plataformas de emprego suportadas
- **LinkedIn**
- **InfoJobs**

---

## 2. O problema que resolve

Procurar emprego hoje é um funil de volume. Estatisticamente, quanto mais
candidaturas relevantes uma pessoa envia, maiores as chances de entrevista.
Mas candidatar-se manualmente é:

- **Lento** — cada vaga exige abrir, ler, preencher e confirmar.
- **Repetitivo** — os mesmos dados de currículo digitados vez após vez.
- **Desmotivador** — o esforço manual leva as pessoas a desistirem cedo.
- **Difícil de escalar** — é inviável aplicar a 30–50 vagas por dia à mão.

O Apliquefy transforma esse funil manual em um processo automatizado e
contínuo: o candidato define a estratégia uma vez, e a máquina executa o
volume.

---

## 3. Como funciona (visão do usuário)

O produto tem duas faces que trabalham juntas:

1. **Painel Web** — onde o usuário configura tudo: currículos, campanhas,
   filtros, plano e acompanhamento de resultados.
2. **Aplicativo Desktop** — o "motor" que roda no computador do usuário e
   executa as candidaturas de verdade, em tempo real, enquanto a máquina está
   ligada.

### Jornada típica
1. O usuário cria uma conta e monta seu **currículo** no painel web.
2. Cria uma **campanha** escolhendo a plataforma (LinkedIn ou InfoJobs) e os
   **filtros de busca** (cargo, localidade, senioridade, tipo de contrato etc.).
3. Baixa e instala o **aplicativo desktop**, faz login e conecta suas contas
   das plataformas (LinkedIn/InfoJobs) — um login seguro feito uma vez.
4. Ativa a campanha. O desktop passa a **buscar vagas compatíveis e se
   candidatar automaticamente**, respeitando o limite diário definido.
5. O usuário acompanha os **relatórios** de candidaturas: quantas foram feitas,
   quais deram certo, quais falharam.

> O trabalho pesado roda **no computador do próprio usuário**, usando as contas
> reais dele nas plataformas. Isso mantém o processo natural e sob controle do
> candidato.

---

## 4. Público-alvo

- **Candidatos ativos** — pessoas em busca de emprego que querem maximizar o
  número de candidaturas relevantes sem gastar horas por dia.
- **Profissionais em transição de carreira** — quem precisa aplicar a muitas
  vagas em pouco tempo.
- **Recém-formados e estagiários** — alto volume de aplicação com filtros de
  nível de entrada (estágio, júnior, jovem aprendiz, trainee).

---

## 5. Catálogo de funcionalidades

### 5.1 Currículos
- Criação e gestão de **múltiplos currículos** por usuário.
- Cada currículo reúne: **dados pessoais, experiências, formação, habilidades
  e idiomas**.
- O currículo é usado tanto para preencher as candidaturas quanto para gerar um
  **PDF** anexado às vagas que exigem envio de arquivo.

### 5.2 Campanhas de automação
Uma campanha é uma estratégia de busca ativa vinculada a um currículo. O
usuário pode ter várias campanhas simultâneas.

- **Escolha de plataforma**: LinkedIn ou InfoJobs.
- **Vínculo com um currículo**: define qual perfil será usado nas candidaturas.
- **Limite diário**: teto de candidaturas por dia, para um ritmo saudável e
  seguro.
- **Controle de estado**: campanhas podem ser **ativadas, pausadas ou
  desativadas** a qualquer momento.
- **Pausa automática de segurança**: se a sessão de login da plataforma
  expirar, as campanhas daquela plataforma são pausadas automaticamente até o
  usuário reconectar.

#### Filtros de busca — LinkedIn
- **Ordenação**: mais relevantes / mais recentes.
- **Data de publicação**: qualquer época, últimas 24h, última semana, último mês.
- **Nível de experiência**: estágio, júnior, pleno, sênior, diretor, executivo.
- **Tipo de vaga**: tempo integral, meio período, contrato, temporário,
  voluntário, estágio, outro.
- **Modelo de trabalho**: remoto, híbrido, presencial.

#### Filtros de busca — InfoJobs
- **Localidade**: todos os 27 estados brasileiros.
- **Raio de distância**: de 5 km a 100 km.
- **Faixa salarial**: de R$ 1.000 a R$ 10.000.
- **Data de publicação**: hoje, últimos 3 dias, última semana, últimos 15 dias,
  último mês.
- **Modelo de trabalho**: presencial, home office, híbrido.
- **Área profissional**: 34 áreas (Administração, TI, Saúde, Engenharia,
  Marketing, Jurídica, Logística, Vendas etc.).
- **Tipo de contrato**: CLT, autônomo, PJ, cooperado, jovem aprendiz, estágio,
  temporário, trainee, outros.
- **Turno/jornada**: integral, parcial (manhã/tarde/noite), noturno.
- **Senioridade**: de estagiário a diretor (14 níveis).
- **PcD (Pessoa com Deficiência)**: filtro por tipo (auditiva, física, visual,
  intelectual, TEA, entre outros).

### 5.3 Execução automatizada com Inteligência Artificial
- A automação é conduzida por um **agente de visão de IA**: ele "enxerga" a
  tela como um usuário faria e decide como preencher e concluir cada
  candidatura, adaptando-se às variações de layout das plataformas.
- Isso torna o processo **mais resiliente** do que scripts rígidos: mudanças
  visuais nas plataformas não quebram a automação com facilidade.

### 5.4 Recursos de IA para o candidato *(evolução recente do produto)*
- **Vozes de IA / múltiplas vozes** — recurso de assistente com voz de IA,
  com suporte a múltiplas vozes.
- **Testes A/B** — capacidade de testar variações (ex.: de currículo ou
  estratégia) para comparar desempenho.

> Estes recursos representam a direção mais recente do produto: ir além da
> automação mecânica e oferecer inteligência que ajuda o candidato a se
> apresentar melhor.

### 5.5 Sessões de login seguras
- O usuário conecta suas contas de LinkedIn e InfoJobs **uma vez**, pelo próprio
  aplicativo, com login real e natural.
- A plataforma **monitora a validade das sessões** e avisa/pausa quando um login
  expira, evitando candidaturas que falhariam.

### 5.6 Relatórios e acompanhamento
- **Registro de cada candidatura**: status individual (pendente, aplicada,
  falhou, ignorada).
- **Relatórios agregados por campanha**: total de candidaturas, sucessos,
  falhas e créditos consumidos/reembolsados.
- **Acompanhamento em tempo real**: o painel reflete a execução ao vivo enquanto
  o desktop trabalha.
- **Métricas de dashboard**: visão geral do desempenho do usuário.

---

## 6. Modelo de negócio e monetização

O Apliquefy opera com um **sistema de créditos**: cada candidatura consome
créditos. Os créditos vêm de **assinaturas mensais** (planos) ou de **compras
avulsas** (pacotes).

### 6.1 Planos de assinatura (créditos mensais recorrentes)

| Plano | Preço/mês | Créditos/mês |
|---|---|---|
| **Starter** | R$ 49,00 | 500 |
| **Professional** | R$ 99,00 | 1.500 |
| **Enterprise** | R$ 249,00 | 5.000 |

- Renovação mensal automática, com recarga de créditos a cada ciclo.
- Gerenciamento de assinatura via portal de billing (upgrade, downgrade,
  cancelamento).

### 6.2 Pacotes de créditos avulsos (compra pontual)

| Pacote | Preço | Créditos |
|---|---|---|
| **50 Créditos** | R$ 20,00 | 50 |
| **100 Créditos** | R$ 35,00 | 100 |
| **200 Créditos** | R$ 60,00 | 200 |

- Créditos avulsos são adicionados **na hora** após a compra.
- Servem para complementar o plano em meses de alta demanda.

### 6.3 Regras do sistema de créditos
- **Consumo por candidatura**: cada candidatura debita créditos.
- **Reembolso automático em falhas**: se uma candidatura falha, o crédito é
  devolvido — o usuário só paga pelo que dá certo.
- **Bloqueio por saldo**: sem saldo suficiente, as ações de candidatura ficam
  bloqueadas, evitando execução sem cobertura.
- **Histórico de transações**: todo crédito adicionado, consumido, reembolsado
  ou ajustado fica registrado.

> **Princípio comercial central:** o usuário paga por **resultado** (candidatura
> concluída), não por tentativa. Falhas não custam créditos.

---

## 7. Diferenciais competitivos

1. **Execução local com contas reais** — a automação roda no computador do
   próprio usuário, usando o login real dele, o que mantém o processo natural e
   sob controle do candidato.
2. **IA de visão** — automação que se adapta às plataformas em vez de depender de
   scripts frágeis.
3. **Cobrança justa** — paga-se por candidatura bem-sucedida; falhas são
   reembolsadas.
4. **Filtros ricos e específicos do Brasil** — cobertura completa dos estados,
   áreas e tipos de contrato brasileiros (especialmente no InfoJobs).
5. **Limite diário saudável** — ritmo controlado que evita comportamento
   artificial e protege as contas do usuário.
6. **Multiplataforma** — LinkedIn e InfoJobs num só painel.

---

## 8. Estrutura do produto (visão de alto nível)

| Componente | Papel de negócio |
|---|---|
| **Painel Web** | Onde o usuário gerencia currículos, campanhas, planos e relatórios. É a vitrine e o centro de controle. |
| **App Desktop** | O motor que executa as candidaturas no computador do usuário, em tempo real. |
| **Motor de automação (IA)** | O "trabalhador" que se candidata às vagas, guiado por inteligência de visão. |

---

## 9. Glossário

- **Campanha** — uma estratégia de busca ativa vinculada a um currículo, com
  filtros e limite diário.
- **Crédito** — unidade de consumo; cada candidatura gasta créditos.
- **Sessão** — o login conectado do usuário numa plataforma (LinkedIn/InfoJobs).
- **Candidatura** — uma aplicação individual a uma vaga, com status próprio.
- **Limite diário** — teto de candidaturas por dia definido na campanha.
- **Relatório** — consolidado de resultados de uma campanha.

---

*Documento vivo — atualizar conforme novas funcionalidades entram no produto.*
