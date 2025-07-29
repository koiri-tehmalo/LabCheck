import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { mockEquipmentSets } from "@/data/mock-data";
import { StatusBadge } from "@/components/dashboard/status-badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function SetsPage() {
  const sets = mockEquipmentSets;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Sets</h1>
          <p className="text-muted-foreground">Manage groups of related equipment.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Set
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sets.map(set => (
          <Card key={set.id}>
            <CardHeader>
              <CardTitle>{set.name}</CardTitle>
              <CardDescription>Location: {set.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-sm font-medium">Items in this set:</h4>
              <Separator />
              <ul className="space-y-3">
                {set.items.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <Link href={`/dashboard/equipment/${item.id}`} className="hover:underline">
                      {item.name}
                    </Link>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
