
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
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  HardDrive,
  Component,
  FileText,
  LogOut,
  LogIn,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { getUser, signOut } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Asset Tracker',
  description: 'Manage your equipment with ease.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="font-body antialiased bg-background">
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
                  {user?.role === 'admin' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Users">
                        <Link href="/dashboard/users">
                          <Users />
                          <span>Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarContent>
              {user ? (
                <SidebarFooter className="p-4 border-t border-sidebar-border flex flex-col gap-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm truncate">
                      <span className="font-semibold text-sidebar-foreground">{user.name}</span>
                      <span className="text-muted-foreground text-xs">{user.email}</span>
                    </div>
                  </div>
                  <form action={signOut} className="w-full">
                      <Button type="submit" variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                      </Button>
                  </form>
                </SidebarFooter>
              ) : (
                 <SidebarFooter className="p-4 border-t border-sidebar-border">
                    <Button asChild className="w-full">
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                 </SidebarFooter>
              )}
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
        <Toaster />
      </body>
    </html>
  );
}
