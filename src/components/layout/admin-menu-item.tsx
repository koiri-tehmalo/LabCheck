'use client';

import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/permissions';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Users } from 'lucide-react';

export function AdminMenuItem() {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!hasPermission(user?.role, 'MANAGE_USERS')) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip="จัดการผู้ใช้งาน" className="rounded-lg transition-glass hover:bg-sidebar-accent/60">
        <Link href="/dashboard/users">
          <Users className="h-4 w-4" />
          <span>จัดการผู้ใช้งาน</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
