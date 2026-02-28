'use client';

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, Trash2, UserCog, ShieldAlert } from 'lucide-react';
import type { Role, User } from '@/lib/types';
import { deleteUser, updateUserRole } from '@/actions/user';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  createdAt: Date;
};

type UserTableProps = {
  data: UserData[];
  onDataChange: () => void;
  currentUser: User | null;
};

export function UserTable({ data, onDataChange, currentUser }: UserTableProps) {
  const { toast } = useToast();
  const [deletingUser, setDeletingUser] = React.useState<UserData | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      toast({ title: 'สำเร็จ', description: 'เปลี่ยนระดับสิทธิ์เรียบร้อยแล้ว' });
      onDataChange();
    } else {
      toast({ title: 'ล้มเหลว', description: res.error, variant: 'destructive' });
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    const res = await deleteUser(deletingUser.id);
    if (res.success) {
      toast({ title: 'สำเร็จ', description: 'ลบผู้ใช้งานเรียบร้อยแล้ว' });
      onDataChange();
    } else {
      toast({ title: 'ล้มเหลว', description: res.error, variant: 'destructive' });
    }
    setDeletingUser(null);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">ผู้ดูแลระบบ (Admin)</Badge>;
      case 'STAFF':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">เจ้าหน้าที่ (Staff)</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead>ชื่อ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>ระดับสิทธิ์</TableHead>
              <TableHead className="hidden sm:table-cell">วันที่สมัคร</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  ไม่พบข้อมูลผู้ใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const isSelf = currentUser?.id === item.id;
                
                return (
                  <TableRow key={item.id} className="border-border/30 glass-row">
                    <TableCell className="font-medium flex items-center gap-2">
                        {item.name}
                        {isSelf && <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-muted-foreground">คุณ</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell>
                      {getRoleBadge(item.role)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {new Date(item.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-white/5">
                            <span className="sr-only">เปิดเมนู</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 glass-elevated border-border/40">
                          <DropdownMenuLabel>เปลี่ยนระดับสิทธิ์</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRoleChange(item.id, 'ADMIN')} disabled={isSelf || item.role === 'ADMIN'} className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4 text-purple-400" /> ตั้งเป็น Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(item.id, 'STAFF')} disabled={isSelf || item.role === 'STAFF'} className="cursor-pointer">
                            <UserCog className="mr-2 h-4 w-4 text-blue-400" /> ตั้งเป็น Staff
                          </DropdownMenuItem>
                          
                          
                          
                          {!isSelf && (
                            <>
                              <DropdownMenuSeparator className="bg-border/40" />
                              <DropdownMenuItem onClick={() => setDeletingUser(item)} className="text-destructive focus:text-destructive cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" /> ลบบัญชีผู้ใช้
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent className="glass-elevated border-destructive/30 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> ยืนยันการลบผู้ใช้งาน
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              คุณต้องการลบบัญชีผู้ใช้ <span className="font-medium text-foreground">{deletingUser?.name}</span> ใช่หรือไม่?
              <br/>
              <span className="text-destructive mt-1 inline-block text-sm">การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลของผู้ใช้นี้จะหายไปถาวร</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="btn-glass border-border/40">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
