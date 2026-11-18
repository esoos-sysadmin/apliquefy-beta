import { Sidebar } from "../components/organisms/Sidebar";
import { NeedsUserBanner } from "../components/molecules/NeedsUserBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* min-w-0: sem ele, tabela larga empurra o main e a página rola na horizontal no celular */}
            <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-8 lg:ml-[264px] lg:pt-8">
                <NeedsUserBanner />
                {children}
            </main>
        </div>
    );
}
