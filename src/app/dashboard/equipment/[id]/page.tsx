
'use client';

import { notFound } from 'next/navigation';
import { EquipmentDetailClient } from '@/components/dashboard/equipment-detail-client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { EquipmentItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getEquipmentItemById(id: string) {
      try {
        const docRef = doc(db, "equipment", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem({
            id: docSnap.id,
            ...data,
            purchaseDate: data.purchaseDate.toDate().toISOString(),
          } as EquipmentItem);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      getEquipmentItemById(params.id);
    }
  }, [params.id]);

  if (loading) {
    return (
        <div className="space-y-4 md:space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid gap-4 md:gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  if (error || !item) {
    return notFound();
  }

  return <EquipmentDetailClient item={item} />;
}
