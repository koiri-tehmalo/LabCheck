
'use client';

import { useState } from 'react';
import type { EquipmentItem, EquipmentStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleCheckBig, TriangleAlert, CircleHelp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateEquipmentStatus } from '@/lib/actions';

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
        setLoadingStatus(null);

        if (result.success) {
            setItem({ ...item, status: newStatus });
            toast({
                title: 'Status Updated',
                description: `Successfully marked "${item.name}" as ${newStatus}.`,
            });
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Failed to update status.',
                variant: 'destructive',
            });
        }
    };
    
    const isButtonLoading = (status: EquipmentStatus) => loadingStatus === status;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Issue / Update Status</CardTitle>
                <CardDescription>
                    If the status of this asset has changed, you can update it here.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                    variant={item.status === 'usable' ? 'default' : 'outline'}
                    disabled={item.status === 'usable' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('usable')}
                    className="bg-green-500/10 border-green-500 text-green-700 hover:bg-green-500/20 data-[variant=default]:bg-green-600 data-[variant=default]:text-white"
                >
                    {isButtonLoading('usable') ? <Loader2 className="animate-spin" /> : <CircleCheckBig />}
                    Mark as Usable
                </Button>
                 <Button 
                    variant={item.status === 'broken' ? 'default' : 'outline'}
                    disabled={item.status === 'broken' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('broken')}
                    className="bg-orange-500/10 border-orange-500 text-orange-700 hover:bg-orange-500/20 data-[variant=default]:bg-orange-500 data-[variant=default]:text-white"
                >
                    {isButtonLoading('broken') ? <Loader2 className="animate-spin" /> : <TriangleAlert />}
                    Mark as Broken
                </Button>
                 <Button 
                    variant={item.status === 'lost' ? 'destructive' : 'outline'}
                    disabled={item.status === 'lost' || !!loadingStatus}
                    onClick={() => handleStatusUpdate('lost')}
                    className="bg-red-500/10 border-red-500 text-red-700 hover:bg-red-500/20 data-[variant=destructive]:bg-red-600 data-[variant=destructive]:text-white"
                >
                    {isButtonLoading('lost') ? <Loader2 className="animate-spin" /> : <CircleHelp />}
                    Mark as Lost
                </Button>
            </CardContent>
        </Card>
    );
}
