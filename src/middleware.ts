// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/settings(.*)',
  '/upload(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about(.*)',
  '/pricing(.*)',
  '/roadmap(.*)',
  '/help-center(.*)',
  '/contact(.*)',
  '/policies(.*)',
  '/api/webhook(.*)',
  '/api/health(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Allow public routes to pass through without authentication
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Protect all other routes
    if (isProtectedRoute(req)) {
      const { userId } = await auth();

      if (!userId) {
        // Redirect to sign-in page if not authenticated
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);

    // If there's an error and it's a protected route, redirect to sign-in
    if (isProtectedRoute(req)) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // For public routes, let them continue even if there's an auth error
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
