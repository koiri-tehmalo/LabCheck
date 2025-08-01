
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import type { User, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { updateUserRole } from "@/lib/actions";

interface UserRoleClientProps {
  user: User;
  currentUser: User | null;
}

export function UserRoleClient({ user, currentUser }: UserRoleClientProps) {
  const { toast } = useToast();
  const canManage = currentUser?.role === 'admin';
  const isSelf = currentUser?.id === user.id;

  const handleRoleChange = async (newRole: UserRole) => {
    if (isSelf) {
        toast({
            title: "Action Forbidden",
            description: "You cannot change your own role.",
            variant: "destructive",
        });
        return;
    }
    
    const result = await updateUserRole(user.id, newRole);

    if (result.success) {
      toast({
        title: "Role Updated",
        description: `${user.name}'s role has been changed to ${newRole}.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  if (!canManage) {
    return (
      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
        {user.role}
      </Badge>
    );
  }

  return (
    <Select
      defaultValue={user.role}
      onValueChange={(value) => handleRoleChange(value as UserRole)}
      disabled={isSelf}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="auditor">Auditor</SelectItem>
        <SelectItem value="guest">Guest</SelectItem>
      </SelectContent>
    </Select>
  );
}
