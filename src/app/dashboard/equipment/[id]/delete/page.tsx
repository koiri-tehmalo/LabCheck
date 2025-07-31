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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { deleteEquipment, getEquipmentItemById } from '@/lib/actions';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { EquipmentItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DeleteConfirmation({ itemId }: { itemId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const [item, setItem] = useState<EquipmentItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEquipmentItemById(itemId).then(data => {
            setItem(data);
            setLoading(false);
        });
    }, [itemId]);

    const handleDelete = async () => {
        if (!item) return;
        try {
            await deleteEquipment(item.id);
            toast({
                title: 'Equipment Deleted',
                description: `The asset "${item.name}" has been deleted.`,
                variant: 'destructive',
            });
            // router.push is handled by the redirect in the server action
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete equipment.',
                variant: 'destructive',
            });
        }
    };
    
    if (loading) {
        return (
             <Card className="border-destructive">
                <CardHeader className="text-center">
                     <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-full max-w-sm mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md border bg-muted/50 p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!item) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Equipment not found. It may have already been deleted.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-destructive">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl text-destructive">Confirm Deletion</CardTitle>
                <CardDescription>
                    Are you sure you want to permanently delete this asset? This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md border bg-muted/50 p-4 text-sm">
                    <p><strong>Asset Name:</strong> {item.name}</p>
                    <p><strong>หมายเลขครุภัณฑ์:</strong> {item.assetId}</p>
                    <p><strong>Model:</strong> {item.model}</p>
                </div>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" className="w-full">Delete Asset</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            equipment item from the database.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/equipment">Cancel</Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export default function DeleteEquipmentPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/equipment">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Equipment List
            </Link>
          </Button>
        </div>
        <DeleteConfirmation itemId={params.id} />
      </div>
    </>
  );
}
