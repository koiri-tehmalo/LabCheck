'use client';

import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import type { EquipmentItem } from "@/lib/types";
import { useEffect, useState, use } from 'react';
import { getEquipmentById } from '@/actions/equipment';
import { Skeleton } from "@/components/ui/skeleton";

export default function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
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
        <div className="flex flex-col gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!item) {
    notFound();
  }
  
  return (
    <div className="flex flex-col gap-4 md:gap-8">
       <Card>
        <CardHeader>
          <CardTitle>แก้ไขครุภัณฑ์</CardTitle>
          <CardDescription>แก้ไขข้อมูลครุภัณฑ์หมายเลข <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{item.assetId}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm defaultValues={item} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  );
}
