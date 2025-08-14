
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const idToken = await request.text();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    getAdminApp(); // Initialize Firebase Admin
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }
}
