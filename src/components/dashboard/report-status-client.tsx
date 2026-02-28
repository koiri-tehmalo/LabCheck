'use client';

import { useState } from 'react';
import type { EquipmentItem, EquipmentStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleCheckBig, TriangleAlert, CircleHelp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateEquipmentStatus } from '@/actions/equipment';

interface ReportStatusClientProps {
    item: EquipmentItem;
    setItem: (item: EquipmentItem) => void;
}

export function ReportStatusClient({ item, setItem }: ReportStatusClientProps) {
    const [loadingStatus, setLoadingStatus] = useState<EquipmentStatus | null>(null);
    const { toast } = useToast();

    const handleStatusUpdate = async (newStatus: EquipmentStatus) => {
        if (item.status === newStatus) return;

        setLoadingStatus(newStatus);
        
        const result = await updateEquipmentStatus(item.id, newStatus);

        if (result.success) {
            setItem({ ...item, status: newStatus });
            toast({
                title: 'อัปเดตสถานะสำเร็จ',
                description: `"${item.name}" ถูกเปลี่ยนเป็น ${newStatus === 'USABLE' ? 'ใช้งานได้' : newStatus === 'BROKEN' ? 'ชำรุด' : 'สูญหาย'}`,
            });
        } else {
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: result.error,
                variant: 'destructive',
            });
        }

        setLoadingStatus(null);
    };
    
    const isButtonLoading = (status: EquipmentStatus) => loadingStatus === status;

    return (
        <Card>
            <CardHeader>
                <CardTitle>แจ้งปัญหา / อัปเดตสถานะ</CardTitle>
                <CardDescription>
                    หากสถานะครุภัณฑ์เปลี่ยนแปลง สามารถอัปเดตได้ที่นี่
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                    variant={item.status === 'USABLE' ? 'default' : 'outline'}
                    disabled={item.status === 'USABLE' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('USABLE')}
                    className="bg-green-500/10 border-green-500 text-green-700 hover:bg-green-500/20 data-[variant=default]:bg-green-600 data-[variant=default]:text-white"
                >
                    {isButtonLoading('USABLE') ? <Loader2 className="animate-spin" /> : <CircleCheckBig />}
                    ใช้งานได้
                </Button>
                 <Button 
                    variant={item.status === 'BROKEN' ? 'default' : 'outline'}
                    disabled={item.status === 'BROKEN' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('BROKEN')}
                    className="bg-orange-500/10 border-orange-500 text-orange-700 hover:bg-orange-500/20 data-[variant=default]:bg-orange-500 data-[variant=default]:text-white"
                >
                    {isButtonLoading('BROKEN') ? <Loader2 className="animate-spin" /> : <TriangleAlert />}
                    ชำรุด
                </Button>
                 <Button 
                    variant={item.status === 'LOST' ? 'destructive' : 'outline'}
                    disabled={item.status === 'LOST' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('LOST')}
                    className="bg-red-500/10 border-red-500 text-red-700 hover:bg-red-500/20 data-[variant=destructive]:bg-red-600 data-[variant=destructive]:text-white"
                >
                    {isButtonLoading('LOST') ? <Loader2 className="animate-spin" /> : <CircleHelp />}
                    สูญหาย
                </Button>
            </CardContent>
        </Card>
    );
}
