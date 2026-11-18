import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "./components/providers/AppProviders";
import { AuthProvider } from "./lib/auth/client/provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Apliquefy",
  description: "Automação de candidaturas a vagas de emprego",
  // PWA (§6.5): no iOS o push só funciona com o app adicionado à tela inicial.
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Apliquefy", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#7A3BFF" };

// Aplica o tema salvo antes da primeira pintura (sem flash do claro no escuro). Padrão: claro.
const THEME_INIT = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        </head>
        {/* Extensões (ColorZilla: cz-shortcut-listen, Grammarly…) injetam atributos no body antes da hidratação. */}
        <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </AuthProvider>
  );
}
