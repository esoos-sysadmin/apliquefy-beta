import { SignIn } from "@clerk/nextjs";

const DEFAULT_REDIRECT = "/desktop?tab=como-funciona";

function isSafeRedirect(value: string | undefined): value is string {
    return typeof value === "string" && value.startsWith("/");
}

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
    const params = await searchParams;
    const raw = Array.isArray(params.redirect_url) ? params.redirect_url[0] : params.redirect_url;

    let redirect = DEFAULT_REDIRECT;
    if (isSafeRedirect(raw)) {
        redirect = raw;
    } else if (raw) {
        try {
            const url = new URL(raw);
            redirect = `${url.pathname}${url.search}${url.hash}`;
        } catch {
            redirect = DEFAULT_REDIRECT;
        }
    }

    return (
        <div className="login flex justify-center mt-4">
            <SignIn forceRedirectUrl={redirect} signUpForceRedirectUrl={redirect} />
        </div>
    );
}
