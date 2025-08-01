
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
