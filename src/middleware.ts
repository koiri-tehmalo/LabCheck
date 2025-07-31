
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAdminApp } from './lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';

  //If no session cookie is present, redirect to login.
  if (!session) {
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //Verify the session cookie. In case the session cookie is invalid, redirect to login.
  try {
     getAdminApp();
    await auth().verifySessionCookie(session, true);
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (request.nextUrl.pathname === '/login') {
     return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
