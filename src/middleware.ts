
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiAuthRoute = request.nextUrl.pathname === '/api/auth';

  // Allow auth API route to be accessed
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // If on the login page
  if (isLoginPage) {
    // If user is already logged in, redirect to home
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, show the login page
    return NextResponse.next();
  }

  // For all other pages, if there is no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there is a session, allow access
  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
