
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
     // Allow access to root for non-logged-in users
    if (pathname === '/') {
        return NextResponse.next();
    }
    // You can decide which pages are public and which require login
    // For now, let's redirect all non-public, non-auth pages to login
    const protectedPrefixes = ['/dashboard'];
    if (protectedPrefixes.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
