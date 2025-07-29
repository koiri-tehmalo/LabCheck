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
import { mockEquipmentItems } from '@/data/mock-data';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

export default function DeleteEquipmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const item = mockEquipmentItems.find((i) => i.id === params.id);

  if (!item) {
    notFound();
  }

  const handleDelete = () => {
    // In a real app, you would make an API call to delete the item.
    console.log(`Deleting item: ${item.id}`);
    toast({
      title: 'Equipment Deleted',
      description: `The asset "${item.name}" has been deleted.`,
      variant: 'destructive',
    });
    router.push('/dashboard/equipment');
  };

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
                <p><strong>Asset ID:</strong> {item.id}</p>
                <p><strong>Model:</strong> {item.model}</p>
             </div>
             <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete Asset</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
