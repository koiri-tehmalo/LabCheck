'use client';

import { notFound } from 'next/navigation';
import { EquipmentDetailClient } from '@/components/dashboard/equipment-detail-client';
import { useEffect, useState, use } from 'react';
import { getEquipmentById } from '@/actions/equipment';
import type { EquipmentItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = unwrappedParams;

  useEffect(() => {
    async function fetchItem() {
      const result = await getEquipmentById(id);
      if (!result) {
        setError(true);
      } else {
        setItem(result);
      }
      setLoading(false);
    }

    if (id) {
      fetchItem();
    }
  }, [id]);

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
