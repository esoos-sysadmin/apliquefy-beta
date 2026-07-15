# Graph Report - .  (2026-07-11)

## Corpus Check
- 308 files · ~289,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1559 nodes · 2650 edges · 137 communities (102 shown, 35 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.78)
- Token cost: 345,753 input · 0 output

## Community Hubs (Navigation)
- Campaign Service & API
- Web Resume Form UI
- Campaign Parameter Forms
- Stripe Billing & Plans
- Turborepo Build Config
- Desktop RPA Process Orchestration
- Desktop package.json Deps
- Browser Session Capture
- ESLint Config Package
- Credits Service & API
- Python Apply-Flow Engine
- Shared Package Deps
- Runner Types & Sessions
- Resume Service & API
- Web Campaign Hooks
- RPA Cognitive Agent (Python)
- Tray App Shell Mockup
- Desktop TS Config
- Root Workspace package.json
- Runner Auth & Settings Page
- API Client & Clerk Auth
- Web Resume Hooks
- Report Service & API
- Job Service & API
- Monorepo Architecture Concepts
- Python Run Orchestrator
- Base TS Config
- Desktop Dev Deps
- Python Resume PDF Render
- Job Application Service
- Credits & Subscription Hooks
- TS Config
- Shared API Types
- Runner Local Flowchart
- Electron IPC Registration
- Desktop Auth Flow
- Runner Zustand Stores
- Web App Dependencies
- Web Dev Dependencies
- Resume Management Mockup
- Session Controller & Heartbeat
- Runner Campaign List UI
- Runner State & Settings IPC
- Runner Settings UI
- Runner Shell UI
- Web Sidebar Navigation
- Next.js TS Config
- Runner State Persistence
- Client Error & Toast
- Architecture Diagram
- Runner Settings Tab Mockup
- Python Engine Base
- Python Web API Client
- Campaigns Page & Modals
- Desktop Download Page
- Electron Main & Engine IPC
- Desktop Runtime Deps
- Clerk Session & Dashboard
- Shared Next.js TS Config
- Campaign Mappers
- Web package.json
- Connect Accounts Mockup
- React Library TS Config
- Robots package.json
- Runner Settings Templates
- InfoJobs RPA Engine
- DB Logical Model
- Desktop Backend API Client
- LinkedIn RPA Engine
- ESLint Flat Config
- Publish package.json
- Electron Builder Config
- Root Scripts
- Prisma Seed
- React Library TS Config
- Campaign Details Modal
- Sequence Diagram Actors
- Sequence Diagram Phases
- App.tsx
- page.tsx
- SyncBadge.tsx
- page.tsx
- page.tsx
- page.tsx
- proxy.ts
- button.tsx
- electron
- electron-builder
- postcss
- tailwindcss
- @types/node
- typescript
- vite
- next.config.js
- next-env.d.ts
- next
- @repo/ui
- postcss
- tailwindcss
- SESSIONS_BROADCAST_CHANNEL
- File Text Icon (template asset)
- Globe Icon (template asset)
- Next.js Wordmark Icon (template asset)
- Turborepo Wordmark Icon Dark (template asset)
- Turborepo Wordmark Icon Light (template asset)
- Vercel Triangle Icon (template asset)
- Window Icon (template asset)
- Apliquefy Architecture Diagram
- Fluxograma Runner Local (Diagrama)
- Apliquefy Modelo Lógico (ER Diagram)
- rpa-engine

## God Nodes (most connected - your core abstractions)
1. `getRunnerState()` - 23 edges
2. `electron/**/*` - 23 edges
3. `compilerOptions` - 17 edges
4. `StripeService` - 17 edges
5. `WebApiClient` - 15 edges
6. `CampaignService` - 15 edges
7. `compilerOptions` - 15 edges
8. `RunnerPlatform` - 14 edges
9. `startRpaProcess()` - 13 edges
10. `updateRunnerState()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Turborepo Starter README` --conceptually_related_to--> `Turborepo Monorepo (npm workspaces)`  [INFERRED]
  README.md → Docs/ai/claude.md
- `apps/web Next.js create-next-app README` --conceptually_related_to--> `apps/web (Next.js panel + API)`  [INFERRED]
  apps/web/README.md → Docs/ai/claude.md
- `Apliquefy Runner HTML Entry` --conceptually_related_to--> `apps/desktop (Electron runner)`  [INFERRED]
  apps/desktop/index.html → Docs/ai/claude.md
- `Apliquefy Visual Cognitive Agent` --conceptually_related_to--> `apps/desktop (Electron runner)`  [INFERRED]
  apps/robots/src/rpa_engine/cognitive/prompts/system.md → Docs/ai/claude.md
- `Apliquefy Visual Cognitive Agent` --shares_data_with--> `Prisma Data Models`  [INFERRED]
  apps/robots/src/rpa_engine/cognitive/prompts/system.md → Docs/ai/claude.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Casca/Alma AI Assistant Protocol** — docs_ai_backend_insctructions_dev_contract, docs_ai_frontend_instructions_output_guidelines, docs_ai_claude_service_controller_pattern [INFERRED 0.80]
- **Apliquefy Monorepo Architecture** — docs_ai_claude_apliquefy, docs_ai_claude_monorepo, docs_ai_claude_apps_web, docs_ai_claude_apps_desktop, docs_ai_claude_packages_database [INFERRED 0.85]
- **Credits Billing Flow** — docs_ai_claude_credits_system, docs_ai_claude_stripe_billing, docs_ai_claude_prisma_models [INFERRED 0.80]
- **Local RPA Subsystem** — docs_arquitetura_apliquefy_arquitetura_drawio_runner_electron, docs_arquitetura_apliquefy_arquitetura_drawio_bot_engine_playwright, docs_arquitetura_apliquefy_arquitetura_drawio_local_storage [EXTRACTED 1.00]
- **Cloud Backend Subsystem (Vercel)** — docs_arquitetura_apliquefy_arquitetura_drawio_web_app_api, docs_arquitetura_apliquefy_arquitetura_drawio_auth_service, docs_arquitetura_apliquefy_arquitetura_drawio_postgres_neon [EXTRACTED 1.00]
- **External Service Integrations** — docs_arquitetura_apliquefy_arquitetura_drawio_web_app_api, docs_arquitetura_apliquefy_arquitetura_drawio_cakto_gateway, docs_arquitetura_apliquefy_arquitetura_drawio_ai_api_gemini, docs_arquitetura_apliquefy_arquitetura_drawio_email_service [EXTRACTED 1.00]
- **Fluxo de Pagamento e Liberacao de Acesso** — docs_arquitetura_apliquefy_diagrama_de_sequencia_usuario, docs_arquitetura_apliquefy_diagrama_de_sequencia_web_app_nextjs, docs_arquitetura_apliquefy_diagrama_de_sequencia_gateway_cakto [INFERRED 0.95]
- **Fluxo de Login e Captura de Cookies de Sessao** — docs_arquitetura_apliquefy_diagrama_de_sequencia_usuario, docs_arquitetura_apliquefy_diagrama_de_sequencia_runner_electron, docs_arquitetura_apliquefy_diagrama_de_sequencia_linkedin_infojobs_webview [INFERRED 0.95]
- **Fluxo de Configuracao e Ativacao da Campanha** — docs_arquitetura_apliquefy_diagrama_de_sequencia_usuario, docs_arquitetura_apliquefy_diagrama_de_sequencia_web_app_nextjs, docs_arquitetura_apliquefy_diagrama_de_sequencia_runner_electron [INFERRED 0.95]
- **Fase de Validação de Sessão e Busca de Vagas** — docs_arquitetura_apliquefy_fluxograma_runner_local_inicio_detecta_campanha, docs_arquitetura_apliquefy_fluxograma_runner_local_sessao_valida, docs_arquitetura_apliquefy_fluxograma_runner_local_notificar_relogar, docs_arquitetura_apliquefy_fluxograma_runner_local_buscar_vagas [INFERRED 0.95]
- **Fase de Análise e Preenchimento de Perguntas** — docs_arquitetura_apliquefy_fluxograma_runner_local_tem_perguntas, docs_arquitetura_apliquefy_fluxograma_runner_local_analisar_pergunta, docs_arquitetura_apliquefy_fluxograma_runner_local_tipo_de_pergunta, docs_arquitetura_apliquefy_fluxograma_runner_local_chamar_api_llm, docs_arquitetura_apliquefy_fluxograma_runner_local_preencher_dados_curriculo [INFERRED 0.95]
- **Fase de Registro de Resultado e Pausa** — docs_arquitetura_apliquefy_fluxograma_runner_local_sucesso, docs_arquitetura_apliquefy_fluxograma_runner_local_registrar_sucesso_bd, docs_arquitetura_apliquefy_fluxograma_runner_local_registrar_erro_print, docs_arquitetura_apliquefy_fluxograma_runner_local_pausa_humanizada, docs_arquitetura_apliquefy_fluxograma_runner_local_email_equipe_dev [INFERRED 0.95]
- **Campaign subsystem (campaigns + platform configs + jobs/reports)** — docs_banco_apliquefy_modelo_logico_campaigns, docs_banco_apliquefy_modelo_logico_campaign_linkedin, docs_banco_apliquefy_modelo_logico_campaign_infojobs, docs_banco_apliquefy_modelo_logico_jobs, docs_banco_apliquefy_modelo_logico_reports, docs_banco_apliquefy_modelo_logico_job_applications [INFERRED 0.85]
- **User account subsystem (users + resumes + transactions + campaigns)** — docs_banco_apliquefy_modelo_logico_users, docs_banco_apliquefy_modelo_logico_resumes, docs_banco_apliquefy_modelo_logico_transaction, docs_banco_apliquefy_modelo_logico_campaigns [INFERRED 0.85]
- **General Settings Toggle Group** — docs_design_apliquefy_runner_settings_tab_general_settings_section, docs_design_apliquefy_runner_settings_tab_start_with_windows_toggle, docs_design_apliquefy_runner_settings_tab_desktop_notifications_toggle [EXTRACTED 1.00]
- **Connect Accounts To Start Automation Flow** — docs_design_apliquefy_runner_settings_connectaccountlinkinfo_login_linkedin, docs_design_apliquefy_runner_settings_connectaccountlinkinfo_login_infojobs, docs_design_apliquefy_runner_settings_connectaccountlinkinfo_account_connection_flow [INFERRED 0.95]
- **Resume Profile Content Sections** — docs_design_apliquefy_web_resume_management_personal_details_section, docs_design_apliquefy_web_resume_management_work_experience_section, docs_design_apliquefy_web_resume_management_skills_section, docs_design_apliquefy_web_resume_management_education_section [EXTRACTED 1.00]
- **Header Actions & Save State** — docs_design_apliquefy_web_resume_management_import_pdf_action, docs_design_apliquefy_web_resume_management_save_changes_action, docs_design_apliquefy_web_resume_management_profile_completeness [EXTRACTED 1.00]
- **Title Bar Region** — docs_design_compact_window_shell_tray_app_simulation_title_bar, docs_design_compact_window_shell_tray_app_simulation_app_title, docs_design_compact_window_shell_tray_app_simulation_close_button [EXTRACTED 1.00]
- **Task Card Controls Region** — docs_design_compact_window_shell_tray_app_simulation_applications_counter, docs_design_compact_window_shell_tray_app_simulation_view_button, docs_design_compact_window_shell_tray_app_simulation_pause_button [EXTRACTED 1.00]
- **Engine Status Footer Region** — docs_design_compact_window_shell_tray_app_simulation_engine_running_uptime, docs_design_compact_window_shell_tray_app_simulation_memory_indicator, docs_design_compact_window_shell_tray_app_simulation_version_indicator [EXTRACTED 1.00]

## Communities (137 total, 35 thin omitted)

### Community 0 - "Campaign Service & API"
Cohesion: 0.06
Nodes (31): CampaignResponse, CampaignResponseError, CampaignResponseSuccess, CampaignWithInfojobs, CampaignWithLinkedin, CampaignWithRelations, CreateInfojobsCampaignInput, CreateLinkedinCampaignInput (+23 more)

### Community 1 - "Web Resume Form UI"
Cohesion: 0.11
Nodes (42): cellStyle(), formatDisplay(), iconBtnStyle, MONTHS_PT, MonthYearPicker(), MonthYearPickerProps, parseValue(), textBtnStyle (+34 more)

### Community 2 - "Campaign Parameter Forms"
Cohesion: 0.06
Nodes (46): SelectField(), TagInput(), FormErrorBanner(), FormErrorBannerProps, InfojobsAreaValue, InfojobsContractValue, InfojobsDateValue, InfojobsFormValues (+38 more)

### Community 3 - "Stripe Billing & Plans"
Cohesion: 0.08
Nodes (20): ClerkUserCreatedEvent, UpsellModal(), UpsellModalProps, PlanosPage(), CreditPackage, formatBRL(), getNextPlan(), getPackageBySlug() (+12 more)

### Community 4 - "Turborepo Build Config"
Cohesion: 0.05
Nodes (38): geistMono, geistSans, metadata, AuthProvider(), APLIQUEFY_WEB_TOKEN, APLIQUEFY_WEB_URL, ^build, ^check-types (+30 more)

### Community 5 - "Desktop RPA Process Orchestration"
Cohesion: 0.12
Nodes (30): registerRpaIpc(), startCampaignRun(), renderResumePdf(), RenderResumeResponse, ResumeApiPayload, broadcast(), sockets, subscribeRunEvents() (+22 more)

### Community 6 - "Desktop package.json Deps"
Cohesion: 0.06
Nodes (33): dotenv, dotenv-cli, dependencies, dotenv, pg, @prisma/adapter-pg, @prisma/client, devDependencies (+25 more)

### Community 7 - "Browser Session Capture"
Cohesion: 0.09
Nodes (18): captureSession(), dismissConsentPopup(), getPlatformSessionDir(), getStorageStatePath(), isValidPlatform(), PLATFORM_CONFIG, PlatformConfig, removeSessionFiles() (+10 more)

### Community 8 - "ESLint Config Package"
Cohesion: 0.06
Nodes (31): eslint-config-prettier, @eslint/js, eslint-plugin-only-warn, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-turbo, globals, @next/eslint-plugin-next (+23 more)

### Community 9 - "Credits Service & API"
Cohesion: 0.11
Nodes (13): CheckBalanceData, CreditsPagination, CreditsResponseError, CreditsResponseSuccess, CreditsServiceResponse, DebitCreditsData, CreditHistoryFilters, creditHistoryFiltersSchema (+5 more)

### Community 10 - "Python Apply-Flow Engine"
Cohesion: 0.12
Nodes (19): Infojobs mechanical engine.  Critical: location must be picked via the autocompl, Infojobs selectors centralized for maintenance., LinkedIn mechanical engine.  Login is assumed (storage_state). Flow:   1. Open `, LinkedIn selectors centralized for maintenance., _apply_action(), execute_apply(), Cognitive apply loop shared by every engine.  Sequence per job:   1. POST /api/j, Drive the visual agent until a terminal status_code, returning the outcome. (+11 more)

### Community 11 - "Shared Package Deps"
Cohesion: 0.07
Nodes (28): dependencies, react, react-dom, devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/node (+20 more)

### Community 12 - "Runner Types & Sessions"
Cohesion: 0.12
Nodes (19): electronAPI, ElectronAPI, RunnerPlatform, RunnerSessionMap, SessionResult, SessionResultCode, SessionStatus, LABELS (+11 more)

### Community 13 - "Resume Service & API"
Cohesion: 0.11
Nodes (12): CreateResumeError, CreateResumeResponse, CreateResumeSucess, ResumeData, certificationsSchema, educationSchema, experienceSchema, idiomsSchema (+4 more)

### Community 14 - "Web Campaign Hooks"
Cohesion: 0.17
Nodes (21): activateCampaign(), createInfojobsCampaign(), createLinkedinCampaign(), deleteCampaign(), getCampaigns(), pauseCampaign(), unwrapCampaignPayload(), updateCampaign() (+13 more)

### Community 15 - "RPA Cognitive Agent (Python)"
Cohesion: 0.14
Nodes (16): AgentDecision, BaseModel, Strict JSON contract for the visual agent (R12)., Any, OpenAI GPT-4o vision client for the cognitive loop.  Sends an annotated screensh, VisualAgent, load_settings(), Runtime configuration loaded from environment variables. (+8 more)

### Community 16 - "Tray App Shell Mockup"
Cohesion: 0.09
Nodes (25): Active Status Badge (Blue Dot), Active Tasks Section, App Title: APLIQUEFY RUNNER, Applications Counter, Campaigns Tab (Active, Blue), Window Close Button (X), Compact Dark Window Shell, Engine Running Uptime (2h 45m) (+17 more)

### Community 17 - "Desktop TS Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, ignoreDeprecations, isolatedModules, jsx (+15 more)

### Community 18 - "Root Workspace package.json"
Cohesion: 0.08
Nodes (23): devDependencies, prettier, turbo, @types/node, typescript, engines, node, turbo (+15 more)

### Community 19 - "Runner Auth & Settings Page"
Cohesion: 0.16
Nodes (18): RunnerAuthState, AccountCard(), AccountCardProps, useAuthActions(), useElectron(), useRunnerBootstrap(), useSessions(), useSettingsActions() (+10 more)

### Community 20 - "API Client & Clerk Auth"
Cohesion: 0.17
Nodes (15): getCreditHistory(), getReport(), getReports(), createCheckoutSession(), createPortalSession(), aggregateReports(), useCampaignMetrics(), useResume() (+7 more)

### Community 21 - "Web Resume Hooks"
Cohesion: 0.19
Nodes (16): createResume(), deleteResume(), getResume(), getResumes(), unwrapResumePayload(), updateResume(), ResumeCard(), ResumeCardSkeleton() (+8 more)

### Community 22 - "Report Service & API"
Cohesion: 0.16
Nodes (11): ReportData, ReportPagination, ReportResponse, ReportResponseError, ReportResponseSuccess, ReportWithCampaign, CreateReportInput, createReportSchema (+3 more)

### Community 23 - "Job Service & API"
Cohesion: 0.16
Nodes (10): JobData, JobPagination, JobResponse, JobResponseError, JobResponseSuccess, CreateJobInput, createJobSchema, ListJobsQuery (+2 more)

### Community 24 - "Monorepo Architecture Concepts"
Cohesion: 0.13
Nodes (20): Apliquefy Runner HTML Entry, Apliquefy Visual Cognitive Agent, apps/web Next.js create-next-app README, Backend Development Contract (casca), Hyper-Direct Playwright Engineer Behavior, Apliquefy Platform, apps/desktop (Electron runner), apps/web (Next.js panel + API) (+12 more)

### Community 25 - "Python Run Orchestrator"
Cohesion: 0.13
Nodes (11): BaseModel, Request, Run lifecycle endpoints (start/stop/status)., run_events(), RunRequest, RunResponse, start_run(), Orchestrator (+3 more)

### Community 26 - "Base TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, declarationMap, esModuleInterop, incremental, isolatedModules, lib, module (+11 more)

### Community 27 - "Desktop Dev Deps"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, concurrently, cross-env, ts-node, @types/react, @types/react-dom, @types/ws (+11 more)

### Community 28 - "Python Resume PDF Render"
Cohesion: 0.21
Nodes (17): BaseModel, Request, Resume PDF rendering endpoint (M3)., render_resume_endpoint(), RenderResumeRequest, RenderResumeResponse, _build_styles(), _coerce_list() (+9 more)

### Community 29 - "Job Application Service"
Cohesion: 0.16
Nodes (8): CreateJobApplicationInput, createJobApplicationSchema, platformEnum, statusEnum, UpdateJobApplicationInput, updateJobApplicationSchema, JobApplicationService, ServiceResponse

### Community 30 - "Credits & Subscription Hooks"
Cohesion: 0.21
Nodes (11): SidebarCredits(), AppProviders(), CreditGateContext, CreditGateContextType, CreditGateProvider(), PacotesPage(), AssinaturaPage(), useCredits() (+3 more)

### Community 31 - "TS Config"
Cohesion: 0.11
Nodes (18): compilerOptions, declaration, declarationMap, esModuleInterop, lib, module, skipLibCheck, sourceMap (+10 more)

### Community 32 - "Shared API Types"
Cohesion: 0.18
Nodes (10): getBalance(), ApiSuccessResponse, PaginatedResponse, CreditBalance, CreditTransaction, CreditWeightConfig, DebitCreditsPayload, DebitCreditsResult (+2 more)

### Community 33 - "Runner Local Flowchart"
Cohesion: 0.13
Nodes (18): Analisar Pergunta, Playwright: Buscar Vagas (Filtro Easy Apply), Chamar API LLM (Contexto: Currículo), Clicar 'Candidatura Simplificada', Email para equipe de desenvolvimento, Enviar Candidatura, Início: Runner Detecta Campanha Ativa, Iterar sobre Lista de Vagas (+10 more)

### Community 34 - "Electron IPC Registration"
Cohesion: 0.22
Nodes (10): createAuthController(), createCampaignController(), AuthIpcOptions, registerAuthIpc(), registerCampaignIpc(), registerSessionsIpc(), registerWindowIpc(), registerIpcHandlers() (+2 more)

### Community 35 - "Desktop Auth Flow"
Cohesion: 0.29
Nodes (13): AuthControllerOptions, AuthSessionPayload, createAuthenticatedState(), isAuthStateValid(), decodeJwtExpiration(), clearDesktopAuthCookies(), fetchDesktopSessionWithCookies(), persistAuthState() (+5 more)

### Community 36 - "Runner Zustand Stores"
Cohesion: 0.18
Nodes (11): CampaignActionsOptions, useCampaignActions(), baseStore, campaignStore, CampaignStoreState, createStore(), Listener, Updater (+3 more)

### Community 37 - "Web App Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @clerk/nextjs, lucide-react, react, react-dom, @repo/database, stripe, svix (+9 more)

### Community 38 - "Web Dev Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, @repo/eslint-config, @repo/typescript-config, @types/node, @types/react, @types/react-dom (+9 more)

### Community 39 - "Resume Management Mockup"
Cohesion: 0.14
Nodes (17): Dark Themed Sectioned Card Layout, Education Section (Add Degree, empty state), Empty State Pattern (No education added yet + CTA), Experience Entry Card (Title, Company, Start/End Date, Description), Import PDF Action, Apliquefy Local-First Agent Branding, Personal Details Section, Professional Summary Textarea (240/500 characters) (+9 more)

### Community 40 - "Session Controller & Heartbeat"
Cohesion: 0.26
Nodes (14): broadcastSessions(), createSessionController(), getSessionController(), persistSession(), SessionController, fetchCampaigns(), updateCampaignStatus(), pauseCampaignsForPlatform() (+6 more)

### Community 41 - "Runner Campaign List UI"
Cohesion: 0.19
Nodes (11): RunnerCampaign, RunnerCampaignStatus, StatusBadge(), StatusBadgeProps, CampaignCard(), CampaignCardProps, CampaignDetails(), CampaignDetailsProps (+3 more)

### Community 42 - "Runner State & Settings IPC"
Cohesion: 0.32
Nodes (10): persistCampaigns(), registerAccountsIpc(), applyRunnerSettings(), registerSettingsIpc(), SettingsIpcOptions, maybeShowRunnerNotification(), notifyCampaignActivated(), notifyCampaignPaused() (+2 more)

### Community 43 - "Runner Settings UI"
Cohesion: 0.14
Nodes (12): RunnerAccountState, RunnerSettings, ToggleSwitch(), ToggleSwitchProps, GeneralSettings(), GeneralSettingsProps, fallbackAccount, fallbackAuth (+4 more)

### Community 44 - "Runner Shell UI"
Cohesion: 0.19
Nodes (11): RunnerCreditBalance, RunnerEngineStatus, RunnerTab, TabBar(), TabBarProps, TitleBar(), TitleBarProps, StatusBar() (+3 more)

### Community 45 - "Web Sidebar Navigation"
Cohesion: 0.19
Nodes (8): NavItem(), NavItemProps, SidebarLogo(), navItems, SidebarNav(), SidebarSession(), Sidebar(), useSessionUser()

### Community 46 - "Next.js TS Config"
Cohesion: 0.14
Nodes (13): compilerOptions, jsx, plugins, exclude, extends, include, node_modules, next.config.js (+5 more)

### Community 47 - "Runner State Persistence"
Cohesion: 0.21
Nodes (11): clone(), defaultAccount, defaultAuth, defaultCreditBalance, defaultSessions, defaultSettings, getStateFilePath(), readStateFromDisk() (+3 more)

### Community 48 - "Client Error & Toast"
Cohesion: 0.17
Nodes (8): ApiError, handleClientError(), Listener, listeners, toast, ToastContext, ToastItem, ToastVariant

### Community 49 - "Architecture Diagram"
Cohesion: 0.26
Nodes (13): AI API (Gemini), Auth Service (NextAuth / JWT), Bot Engine (Playwright), Cakto Gateway, Cloud Infrastructure (Vercel), Email Service, LinkedIn / InfoJobs, Local Storage (Encrypted Cookies) (+5 more)

### Community 50 - "Runner Settings Tab Mockup"
Cohesion: 0.18
Nodes (13): Account Connection Section, Close (X) Button, Connected Account Card (Alex Morgan, Local Node), Dark Themed Modal Window Layout, Desktop Notifications Toggle (Off), Disconnect Account Button, General Settings Section, Save Changes Button (Gradient CTA) (+5 more)

### Community 51 - "Python Engine Base"
Cohesion: 0.23
Nodes (7): ABC, BaseEngine, EngineContext, Common engine contract and shared types., Run orchestration: coordinates engines, agent, debit, daily limit., open_browser_context(), Browser context bootstrap from a Playwright storage_state.json.

### Community 53 - "Campaigns Page & Modals"
Cohesion: 0.26
Nodes (8): CampaignCardSkeleton(), ConfirmDialog(), ConfirmDialogProps, CampaignEditModal(), CampaignsPage(), platformOptions, statusOptions, useCampaigns()

### Community 54 - "Desktop Download Page"
Cohesion: 0.23
Nodes (6): DesktopDownloadTab(), DesktopHowItWorksTab(), Tab, tabs, desktopPlatforms, desktopSteps

### Community 55 - "Electron Main & Engine IPC"
Cohesion: 0.33
Nodes (8): broadcastEngineStatus(), buildEngineStatus(), engineStartedAt, formatUptime(), pushInitialEngineStatus(), registerEngineIpc(), createMainWindow(), stopSessionHeartbeat()

### Community 56 - "Desktop Runtime Deps"
Cohesion: 0.18
Nodes (11): dependencies, playwright, react, react-dom, react-router-dom, ws, react, react-dom (+3 more)

### Community 57 - "Clerk Session & Dashboard"
Cohesion: 0.40
Nodes (6): GET(), Dashboard(), getAuthSession(), getCurrentSessionUser(), getDesktopSessionToken(), Home()

### Community 58 - "Shared Next.js TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 59 - "Campaign Mappers"
Cohesion: 0.33
Nodes (7): brazilStateLabels, formatDistanceToNow(), mapCampaign(), mapCampaignLocation(), mapCampaignNotes(), fetchCampaignById(), RunnerCampaignApiModel

### Community 60 - "Web package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, check-types, dev, lint, start (+1 more)

### Community 61 - "Connect Accounts Mockup"
Cohesion: 0.24
Nodes (10): Account Connection Flow, Lightning Bolt Brand Icon, Apliquefy Runner Header With Close, Connect Your Accounts Heading, Help & Support External Link, Login With InfoJobs Button, Login With LinkedIn Button, Campaigns / Settings Nav Tabs (+2 more)

### Community 62 - "React Library TS Config"
Cohesion: 0.20
Nodes (9): compilerOptions, outDir, exclude, extends, include, dist, node_modules, src (+1 more)

### Community 63 - "Robots package.json"
Cohesion: 0.22
Nodes (8): author, description, keywords, license, main, name, type, version

### Community 64 - "Runner Settings Templates"
Cohesion: 0.28
Nodes (6): GradientButton(), GradientButtonProps, AuthGate(), AuthGateProps, SettingsTemplate(), SettingsTemplateProps

### Community 65 - "InfoJobs RPA Engine"
Cohesion: 0.42
Nodes (3): InfojobsEngine, Any, R07: localização SEMPRE via dropdown, nunca texto livre.

### Community 66 - "DB Logical Model"
Cohesion: 0.28
Nodes (9): campaign_infojobs, campaign_linkedin, campaigns, job_applications, jobs, reports, resumes, Transaction (+1 more)

### Community 67 - "Desktop Backend API Client"
Cohesion: 0.43
Nodes (5): registerCreditIpc(), apiRequest(), getApiUrl(), getAuthToken(), fetchCreditBalance()

### Community 69 - "ESLint Flat Config"
Cohesion: 0.39
Nodes (3): config, nextJsConfig, config

### Community 70 - "Publish package.json"
Cohesion: 0.29
Nodes (6): license, name, private, publishConfig, access, version

### Community 71 - "Electron Builder Config"
Cohesion: 0.33
Nodes (6): build, appId, extraResources, files, dist/**, dist-electron/**

### Community 72 - "Root Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:robots, dev, electron:dev, postinstall

### Community 73 - "Prisma Seed"
Cohesion: 0.33
Nodes (4): adapter, __dirname, pool, prisma

### Community 74 - "React Library TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, jsx, extends, ./base.json, $schema

### Community 75 - "Campaign Details Modal"
Cohesion: 0.80
Nodes (3): CampaignDetailsModal(), formatDateTime(), formatDistanceToNow()

### Community 76 - "Sequence Diagram Actors"
Cohesion: 0.60
Nodes (5): Gateway (Cakto), LinkedIn/Infojobs (WebView), Runner (Electron), Usuario (Ator), Web App (Next.js)

### Community 77 - "Sequence Diagram Phases"
Cohesion: 0.50
Nodes (4): Apliquefy - Diagrama de Sequencia (UML), Fase 1: Aquisicao, Fase 3: Configuracao, Fase 2: Instalacao e Vinculo

## Knowledge Gaps
- **475 isolated node(s):** `AuthControllerOptions`, `SessionController`, `brazilStateLabels`, `AuthIpcOptions`, `engineStartedAt` (+470 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AuthControllerOptions`, `SessionController`, `brazilStateLabels` to the rest of the system?**
  _498 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Campaign Service & API` be split into smaller, more focused modules?**
  _Cohesion score 0.05779220779220779 - nodes in this community are weakly interconnected._
- **Should `Web Resume Form UI` be split into smaller, more focused modules?**
  _Cohesion score 0.1063973063973064 - nodes in this community are weakly interconnected._
- **Should `Campaign Parameter Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.061495457721872815 - nodes in this community are weakly interconnected._
- **Should `Stripe Billing & Plans` be split into smaller, more focused modules?**
  _Cohesion score 0.07673469387755102 - nodes in this community are weakly interconnected._
- **Should `Turborepo Build Config` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Desktop RPA Process Orchestration` be split into smaller, more focused modules?**
  _Cohesion score 0.12162162162162163 - nodes in this community are weakly interconnected._