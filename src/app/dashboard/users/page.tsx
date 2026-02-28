'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ShieldAlert, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUsers } from '@/actions/user';
import { hasPermission } from '@/lib/permissions';
import { Skeleton } from '@/components/ui/skeleton';
import { UserTable } from '@/components/dashboard/users/user-table';
import type { Role } from '@/lib/types';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  createdAt: Date;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, loading: authLoading } = useAuth();
  
  const canManageUsers = hasPermission(user?.role, 'MANAGE_USERS');

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data as UserData[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && canManageUsers) {
      fetchUsers();
    } else if (!authLoading && !canManageUsers) {
      setLoading(false);
    }
  }, [authLoading, canManageUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (authLoading) {
    return (
      <div className="space-y-4 md:space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-card border-border/40 min-h-[50vh]">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
        <p className="text-muted-foreground">คุณไม่มีสิทธิ์ในการจัดการผู้ใช้งานในระบบ</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground">ควบคุมสิทธิ์และบัญชีผู้ใช้ในระบบ</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
         <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className='flex items-center gap-3'>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(230,80%,62%,0.2)] to-[hsl(260,70%,62%,0.2)]">
                <Users className="h-6 w-6 text-[hsl(230,80%,70%)]" />
              </div>
              <div>
                <CardTitle>บัญชีผู้ใช้ทั้งหมด ({users.length})</CardTitle>
                <CardDescription>รายชื่อผู้ใช้งานและระดับสิทธิ์</CardDescription>
              </div>
            </div>
            
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ค้นหาชื่อ หรืออีเมล..." 
                className="pl-10 glass-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <UserTable data={filteredUsers} onDataChange={fetchUsers} currentUser={user} />
          )}
        </CardContent>
      </div>
    </div>
  );
}
