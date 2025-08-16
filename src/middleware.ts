
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow access to the equipment list and individual equipment pages for everyone
  if (pathname.startsWith('/dashboard/equipment')) {
    return NextResponse.next();
  }

  // If the user is logged in and tries to access a public route (login/register), redirect to home
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not logged in and tries to access a protected route, redirect to login
  if (!session && !isPublicRoute) {
    // Allow access to the root dashboard page for non-logged-in users as a public landing page.
    if (pathname === '/') {
        return NextResponse.next();
    }
    // Any other route that is not public requires a session.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
