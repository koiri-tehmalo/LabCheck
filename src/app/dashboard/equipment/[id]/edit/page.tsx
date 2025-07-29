'use client'

import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipmentItemById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditEquipmentPage({ params }: { params: { id: string } }) {
  const item = await getEquipmentItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Edit Equipment</CardTitle>
          <CardDescription>Update the details for asset <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{item.id}</span>.</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm defaultValues={item} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  );
}
