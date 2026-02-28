'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import type { User, Role } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}



export function useAuth(): AuthContextValue {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return { user: null, loading: true };
  }

  if (!session?.user) {
    return { user: null, loading: false };
  }

  return {
    user: {
      id: session.user.id ?? '',
      name: session.user.name ?? 'User',
      email: session.user.email ?? '',
      avatar: session.user.image ?? null,
      role: ((session.user as any).role as Role) ?? 'STAFF',
    },
    loading: false,
  };
}
