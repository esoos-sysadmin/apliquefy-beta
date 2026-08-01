export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: "100vh", background: "transparent" }}>
            {children}
        </div>
    );
}
