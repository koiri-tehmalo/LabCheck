import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const idToken = await request.text();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

  try {
    const adminApp = getAdminApp();
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });

    // ✅ ใช้ NextResponse แทน
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn / 1000, // ต้องเป็นวินาที
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }
}
