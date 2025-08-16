
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register'];

  // If the user is logged in and tries to access a public route, redirect to home
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not logged in and tries to access a protected route, redirect to login
  if (!session && !publicRoutes.includes(pathname)) {
     // Allow access to root for non-logged-in users, as it's the dashboard.
    if (pathname === '/') {
        return NextResponse.next();
    }
    // Any other route that is not public requires a session.
    // This simplifies the logic by not needing a specific list of protected routes.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
