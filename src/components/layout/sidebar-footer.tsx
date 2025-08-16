
"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarFooter as FooterContainer } from "@/components/ui/sidebar";
import { signOut } from "@/lib/actions";
import type { User } from "@/lib/types";

export default function SidebarFooter({ user }: { user: User | null }) {
  return user ? (
    <FooterContainer className="p-4 border-t border-sidebar-border flex flex-col gap-4">
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
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </form>
    </FooterContainer>
  ) : (
    <FooterContainer className="p-4 border-t border-sidebar-border">
      <Button asChild className="w-full">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    </FooterContainer>
  );
}
