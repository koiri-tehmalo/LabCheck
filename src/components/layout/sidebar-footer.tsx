"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarFooter as FooterContainer } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "next-auth/react";

export default function SidebarFooter() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return user ? (
    <FooterContainer className="p-4 border-t border-sidebar-border/40 flex flex-col gap-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="h-9 w-9 avatar-glow group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(260,70%,55%)] text-white text-sm font-semibold">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm truncate group-data-[collapsible=icon]:hidden w-full relative">
          <div className="flex items-center gap-2 w-full pr-2">
            <span className="font-semibold text-sidebar-foreground truncate">{user.name}</span>
            {user.role && (
               <span className="shrink-0 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[hsl(230,80%,62%,0.15)] text-[hsl(230,80%,70%)] border border-[hsl(230,80%,62%,0.2)]">
                 {user.role}
               </span>
            )}
          </div>
          <span className="text-muted-foreground text-xs truncate mt-0.5 w-[140px]">{user.email}</span>
        </div>
      </div>
      <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start group-data-[collapsible=icon]:justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-glass group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">ออกจากระบบ</span>
        </Button>
    </FooterContainer>
  ) : (
    <FooterContainer className="p-4 border-t border-sidebar-border/40 group-data-[collapsible=icon]:p-2">
      <Button asChild className="w-full btn-gradient border-0 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:min-w-0">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
          <span className="group-data-[collapsible=icon]:hidden">เข้าสู่ระบบ</span>
        </Link>
      </Button>
    </FooterContainer>
  );
}
