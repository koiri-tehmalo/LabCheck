
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import type { EquipmentSet, EquipmentItem, User } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';


const fromSnapshotToEquipmentItem = (snapshot: any): EquipmentItem => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        ...data,
        purchaseDate: data.purchaseDate.toDate().toISOString(),
    } as EquipmentItem;
};


export default function SetsPage() {
  const [sets, setSets] = useState<EquipmentSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');


  const fetchSets = async () => {
    if (!user) {
        setSets([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
        const setsCollection = collection(db, "equipment_sets");
        const setsSnapshot = await getDocs(setsCollection);
        const setList = setsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as EquipmentSet[];

        if (setList.length === 0) {
            setSets([]);
            setLoading(false);
            return;
        }

        const allItemsSnapshot = await getDocs(collection(db, "equipment"));
        const allItems = allItemsSnapshot.docs.map(fromSnapshotToEquipmentItem);

        const setsWithItems = setList.map(set => ({
            ...set,
            items: allItems.filter(item => item.setId === set.id)
        }));
        setSets(setsWithItems);

    } catch (error) {
        console.error("Failed to fetch sets:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [user]);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchSets(); // Refresh data
  };
  
  const canManage = !!user;

  const filteredSets = useMemo(() => {
    if (!searchTerm) return sets;
    return sets.filter(set =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sets, searchTerm]);


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

       <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by set name..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            {filteredSets.map(set => (
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
          {filteredSets.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-medium text-muted-foreground">No Equipment Sets Found</h3>
                <p className="text-sm text-muted-foreground mt-2">Create a new set or adjust your search term to get started.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
