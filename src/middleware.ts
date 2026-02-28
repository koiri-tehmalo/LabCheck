import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname === '/';
  
  // Allow public access to equipment detail page (via QR code)
  const isEquipmentDetail = /^\/dashboard\/equipment\/[^\/]+$/.test(request.nextUrl.pathname);

  if (isDashboardPage && !token && !isEquipmentDetail) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
