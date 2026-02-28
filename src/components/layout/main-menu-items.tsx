'use client';

import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HardDrive,
  Component as ComponentIcon,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { AdminMenuItem } from '@/components/layout/admin-menu-item';

export function MainMenuItems() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="แดชบอร์ด" className="rounded-lg transition-glass hover:bg-sidebar-accent/60">
          <Link href="/">
            <LayoutDashboard className="h-4 w-4" />
            <span>แดชบอร์ด</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="รายการครุภัณฑ์" className="rounded-lg transition-glass hover:bg-sidebar-accent/60">
          <Link href="/dashboard/equipment">
            <HardDrive className="h-4 w-4" />
            <span>รายการครุภัณฑ์</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="ชุดครุภัณฑ์" className="rounded-lg transition-glass hover:bg-sidebar-accent/60">
          <Link href="/dashboard/sets">
            <ComponentIcon className="h-4 w-4" />
            <span>ชุดครุภัณฑ์</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="รายงาน" className="rounded-lg transition-glass hover:bg-sidebar-accent/60">
          <Link href="/dashboard/reports">
            <FileText className="h-4 w-4" />
            <span>รายงาน</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <AdminMenuItem />
    </>
  );
}
