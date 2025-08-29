
'use client';

import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";

interface UserRoleClientProps {
  user: User;
  currentUser: User | null;
}

export function UserRoleClient({ user, currentUser }: UserRoleClientProps) {
  // Role management has been disabled as it requires the Admin SDK.
  // This component will now just display the role as a static badge.
  const isSelf = currentUser?.id === user.id;

  return (
      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">
        {isSelf ? `${user.role} (You)` : user.role}
      </Badge>
  );
}
