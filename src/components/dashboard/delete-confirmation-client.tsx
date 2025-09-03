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
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function DeleteConfirmationClient({ item }: { item: EquipmentItem }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const docRef = doc(db, "equipment", item.id);
            await deleteDoc(docRef);
            
            toast({
                title: 'Equipment Deleted',
                description: `The asset "${item.name}" has been deleted.`,
                variant: 'destructive',
            });
            
            router.push('/dashboard/equipment');
            router.refresh();

        } catch (error) {
            console.error("Error deleting equipment: ", error);
            toast({
                title: 'Error',
                description: 'Failed to delete equipment. Please check your connection or permissions.',
                variant: 'destructive',
            });
        }
    };

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
            </CardContent>
        </Card>
    );
}
