'use client';

import { notFound } from 'next/navigation';
import { DeleteConfirmationClient } from '@/components/dashboard/delete-confirmation-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { getEquipmentById } from '@/actions/equipment';
import type { EquipmentItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DeleteEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = unwrappedParams;

  useEffect(() => {
    async function fetchItem() {
      const result = await getEquipmentById(id);
      setItem(result);
      setLoading(false);
    }
    if (id) {
      fetchItem();
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
          <Button variant="outline" asChild className="btn-glass border-border/40">
            <Link href="/dashboard/equipment">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปรายการครุภัณฑ์
            </Link>
          </Button>
        </div>
        <DeleteConfirmationClient item={item} />
      </div>
    </>
  );
}
