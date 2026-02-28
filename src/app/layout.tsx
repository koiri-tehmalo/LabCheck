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
import { MainMenuItems } from '@/components/layout/main-menu-items';

export const metadata: Metadata = {
  title: 'LabCheck — ระบบจัดการครุภัณฑ์',
  description: 'ระบบจัดการและตรวจสอบครุภัณฑ์สำหรับห้องปฏิบัติการ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark" suppressHydrationWarning>
      <body className="font-body antialiased bg-background gradient-mesh" suppressHydrationWarning>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full relative z-10">
              <Sidebar collapsible="icon" className="glass-sidebar">
                <SidebarHeader className="p-4 justify-between items-center flex">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(260,70%,55%)] rounded-lg text-white shadow-lg shadow-[hsl(230,80%,55%,0.3)] group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:mx-auto">
                      <HardDrive className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                    </div>
                    <span className="font-bold text-lg text-sidebar-foreground tracking-tight group-data-[collapsible=icon]:hidden">LabCheck</span>
                  </div>
                  <SidebarTrigger className="hidden md:flex text-sidebar-foreground/60 hover:text-sidebar-foreground" />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu className="px-2 space-y-1">
                    <MainMenuItems />
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter /> 
              </Sidebar>
              <div className="flex-1 flex flex-col w-full min-w-0">
                <header className="p-4 md:hidden flex items-center justify-start border-b border-border/40 backdrop-blur-md bg-background/80">
                    <SidebarTrigger />
                    <h2 className="ml-4 font-semibold bg-gradient-to-r from-[hsl(230,80%,70%)] to-[hsl(260,70%,70%)] bg-clip-text text-transparent">LabCheck</h2>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-10 bg-transparent overflow-y-auto">
                  <div className="w-full h-full">
                    {children}
                  </div>
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
