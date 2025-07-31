
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const idToken = await request.text();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

  cookies().set('session', sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  });

  return NextResponse.json({ status: 'success' });
}
