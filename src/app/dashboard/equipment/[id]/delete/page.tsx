
'use client';

import { notFound } from 'next/navigation';
import { DeleteConfirmationClient } from '@/components/dashboard/delete-confirmation-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { EquipmentItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeleteEquipmentPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    async function getEquipmentItemById(itemId: string) {
      const docRef = doc(db, "equipment", itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         const data = docSnap.data();
          setItem({
            id: docSnap.id,
            ...data,
            purchaseDate: data.purchaseDate.toDate().toISOString(),
          } as EquipmentItem);
      }
      setLoading(false);
    }
    if (id) {
      getEquipmentItemById(id);
    }
  }, [id]);


  if (loading) {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
             <Skeleton className="h-10 w-48" />
             <Skeleton className="h-64 w-full" />
        </div>
    )
  }

  if (!item) {
    notFound();
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
        <DeleteConfirmationClient item={item} />
      </div>
    </>
  );
}
