import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipmentItemById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { use } from 'react';

// Define a simple promise-based fetcher for server components
async function fetchItem(id: string) {
    return getEquipmentItemById(id);
}

export default function EditEquipmentPage({ params }: { params: { id: string } }) {
  // Use React.use to resolve the promise, which is the modern way
  const item = use(fetchItem(params.id));

  if (!item) {
    notFound();
  }
  
  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle>Edit Equipment</CardTitle>
          <CardDescription>Update the details for asset <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{item.assetId}</span>.</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm defaultValues={item} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  );
}
