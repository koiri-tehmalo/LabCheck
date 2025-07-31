'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getEquipmentSets, getUser } from "@/lib/actions";
import { useEffect, useState } from "react";
import type { EquipmentSet, User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SetForm } from "@/components/dashboard/set-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function SetsPage() {
  const [sets, setSets] = useState<EquipmentSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);


  const fetchSetsAndUser = async () => {
    setLoading(true);
    const itemsPromise = getEquipmentSets();
    const userPromise = getUser();
    const [items, userData] = await Promise.all([itemsPromise, userPromise]);
    setSets(items);
    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    fetchSetsAndUser();
  }, []);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchSetsAndUser(); // Refresh data
  };
  
  const canManage = user?.role === 'admin' || user?.role === 'auditor';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Sets</h1>
          <p className="text-muted-foreground">Manage groups of related equipment.</p>
        </div>
        {canManage && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Set
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Create New Equipment Set</DialogTitle>
                <DialogDescription>
                    Fill out the form below to create a new equipment set.
                </DialogDescription>
                </DialogHeader>
                <SetForm onSuccess={handleSuccess} />
            </DialogContent>
            </Dialog>
        )}
      </div>

      {loading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <>
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
                   {set.items && set.items.length > 0 ? (
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
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No items in this set.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {sets.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-medium text-muted-foreground">No Equipment Sets Found</h3>
                <p className="text-sm text-muted-foreground mt-2">Create a new set to get started.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
