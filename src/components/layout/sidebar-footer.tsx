
"use client";

import Link from "next/link";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarFooter as FooterContainer } from "@/components/ui/sidebar";
import { signOut, updateUserAvatar } from "@/lib/actions";
import type { User } from "@/lib/types";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SidebarFooter({ user }: { user: User | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await updateUserAvatar(formData);
      toast({
        title: "Avatar Updated",
        description: "Your new avatar has been saved.",
      });
    } catch (error) {
      console.error("Failed to update avatar", error);
      toast({
        title: "Upload Failed",
        description: "Could not update your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return user ? (
    <FooterContainer className="p-4 border-t border-sidebar-border flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
        <button 
          onClick={handleAvatarClick} 
          disabled={isUploading}
          className="relative rounded-full disabled:cursor-not-allowed"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
          )}
        </button>
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
