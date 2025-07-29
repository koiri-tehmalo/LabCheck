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
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mock-data';
import {
  LayoutDashboard,
  HardDrive,
  Component,
  FileText,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4 justify-between items-center flex">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
                <HardDrive className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">Asset Tracker</span>
            </div>
            <SidebarTrigger className="hidden md:flex" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/equipment" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Equipment">
                    <HardDrive />
                    <span>Equipment</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/dashboard/sets" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Sets">
                        <Component />
                        <span>Equipment Sets</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/reports" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Reports">
                        <FileText />
                        <span>Reports</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm truncate">
                  <span className="font-semibold text-sidebar-foreground">{mockUser.name}</span>
                  <span className="text-muted-foreground text-xs">{mockUser.email}</span>
                </div>
              </div>
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
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
  );
}
