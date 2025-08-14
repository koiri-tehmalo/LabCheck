
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import uiConfig from '@/lib/firebaseui.config';
import { HardDrive } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const StyledFirebaseAuth = dynamic(
  () => import('@/lib/firebaseui'),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // We are only listening for auth state changes to show/hide the UI.
    // The redirection is now handled by the FirebaseUI config.
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
         <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
                <HardDrive className="h-8 w-8" />
            </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Asset Tracker</h1>
          <p className="text-muted-foreground mt-2">Welcome! Please sign in to continue.</p>
        </div>
        {!isSignedIn ? (
          <>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
            <Separator className="my-6" />
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
          </>
        ) : (
             <div className="text-center">
                <p>You are signed in. Redirecting...</p>
            </div>
        )}
      </div>
    </main>
  );
}
