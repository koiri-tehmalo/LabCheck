
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HardDrive,
  Component,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import SidebarFooter from '@/components/layout/sidebar-footer';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'Asset Tracker',
  description: 'Manage your equipment with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // User is now fetched on the client-side via AuthProvider
  return (
    <html lang="en">
      <body className="font-body antialiased bg-background">
        <AuthProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar collapsible="icon">
                <SidebarHeader className="p-4 justify-between items-center flex">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                      <HardDrive className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-lg text-sidebar-foreground">LabCheck</span>
                  </div>
                  <SidebarTrigger className="hidden md:flex" />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Dashboard">
                        <Link href="/">
                          <LayoutDashboard />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Equipment">
                        <Link href="/dashboard/equipment">
                          <HardDrive />
                          <span>รายการครุภัณฑ์</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Sets">
                        <Link href="/dashboard/sets">
                              <Component />
                              <span>ชุดครุภัณฑ์</span>
                          </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Reports">
                        <Link href="/dashboard/reports">
                              <FileText />
                              <span>Reports</span>
                          </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter />
              </Sidebar>
              <div className="flex-1 flex flex-col">
                <header className="p-4 md:hidden flex items-center justify-start border-b">
                    <SidebarTrigger />
                    <h2 className="ml-4 font-semibold">Asset Tracker</h2>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

    