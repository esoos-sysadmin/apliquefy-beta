export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen px-4 py-10 text-white">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                {children}
            </div>
        </main>
    );
}
