import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/cadastro(.*)',
  '/lp',
  '/planos(.*)',
  '/obrigado(.*)',
  '/api/webhooks(.*)',
  '/api/test(.*)',
  '/api/checkout/onboarding(.*)',
  '/api/desktop-auth(.*)',
  '/desktop-auth(.*)',
  // Túnel do Sentry (tunnelRoute no next.config.js). Sem isto o clerkMiddleware
  // exige sessão e o evento de erro de quem está deslogado nunca chega.
  '/monitoring(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {

  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
