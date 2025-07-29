import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { EquipmentTable } from "@/components/dashboard/equipment-table";
import { mockEquipmentItems } from "@/data/mock-data";
import Link from "next/link";

export default function EquipmentPage() {
  // In a real app, data fetching would be done here
  const equipment = mockEquipmentItems;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
        <p className="text-muted-foreground">Manage all your equipment assets.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search equipment..." className="pl-10" />
        </div>
        <Button asChild>
          <Link href="/dashboard/equipment/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Equipment
          </Link>
        </Button>
      </div>
      
      <EquipmentTable data={equipment} />
    </div>
  );
}
