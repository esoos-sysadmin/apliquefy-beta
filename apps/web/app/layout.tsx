import type { Metadata } from "next";
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
};

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
