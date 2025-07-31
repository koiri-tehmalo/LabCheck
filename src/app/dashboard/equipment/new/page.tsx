import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEquipmentPage() {
  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <CardTitle>เพิ่มครุภัณฑ์ชิ่นใหม่</CardTitle>
          <CardDescription>Fill out the form below to add a new asset to the inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
