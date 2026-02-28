'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import type { EquipmentItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { deleteEquipment } from '@/actions/equipment';

export function DeleteConfirmationClient({ item }: { item: EquipmentItem }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteEquipment(item.id);

        if (result.success) {
            toast({
                title: 'ลบครุภัณฑ์สำเร็จ',
                description: `ครุภัณฑ์ "${item.name}" ถูกลบแล้ว`,
                variant: 'destructive',
            });
            router.push('/dashboard/equipment');
            router.refresh();
        } else {
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: result.error,
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="glass-card border-rose-500/30">
            <CardHeader className="text-center">
                <div className="mx-auto bg-rose-500/15 p-3 rounded-full w-fit">
                    <AlertTriangle className="h-8 w-8 text-rose-400" />
                </div>
                <CardTitle className="text-2xl text-rose-400">ยืนยันการลบ</CardTitle>
                <CardDescription>
                    คุณแน่ใจหรือไม่ว่าต้องการลบครุภัณฑ์นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border border-border/30 bg-[hsl(220,15%,10%)] p-4 text-sm">
                    <p><strong>ชื่อครุภัณฑ์:</strong> {item.name}</p>
                    <p><strong>หมายเลขครุภัณฑ์:</strong> {item.assetId}</p>
                    <p><strong>รุ่น:</strong> {item.model}</p>
                </div>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" className="w-full">ลบครุภัณฑ์</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-elevated border-border/40">
                        <AlertDialogHeader>
                        <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การดำเนินการนี้จะลบครุภัณฑ์ออกจากฐานข้อมูลอย่างถาวร
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">ลบ</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
