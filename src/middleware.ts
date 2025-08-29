
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Since we moved to client-side auth, middleware can't reliably
  // know the user's auth state from a cookie anymore.
  // We will allow all requests to pass through and handle auth checks
  // on the client-side within each page or component.
  
  // This simplifies the middleware significantly.
  // You might want to add back rules later if you have pages
  // that are strictly server-gated and don't have a client-side component.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
