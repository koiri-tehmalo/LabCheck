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


function DeleteConfirmation({ item }: { item: EquipmentItem }) {
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
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
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete Asset</Button>
                </div>
            </CardContent>
        </Card>
    );
}


export default async function DeleteEquipmentPage({ params }: { params: { id: string } }) {
  const item = await getEquipmentItemById(params.id);

  if (!item) {
    return <div>Equipment not found.</div>;
  }

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
        <DeleteConfirmation item={item} />
      </div>
    </>
  );
}
