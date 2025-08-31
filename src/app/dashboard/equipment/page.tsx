
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { EquipmentTable } from "@/components/dashboard/equipment-table";
import { useState, useEffect, useMemo } from "react";
import type { EquipmentItem, User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { useAuth } from "@/hooks/use-auth";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from "@/components/ui/skeleton";

const fromSnapshotToEquipmentItem = (snapshot: any): EquipmentItem => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        ...data,
        purchaseDate: data.purchaseDate.toDate().toISOString(),
    } as EquipmentItem;
};


export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "equipment"), orderBy("purchaseDate", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(fromSnapshotToEquipmentItem);
      setEquipment(items);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      // You might want to show a toast or an error message here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchEquipment();
    }
  }, [authLoading]);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchEquipment(); // Refresh data
  };
  
  const canManage = !!user;

  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipment;
    return equipment.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assetId && item.assetId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [equipment, searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">รายการครุภัณฑ์</h1>
        <p className="text-muted-foreground">จัดการครุภัณฑ์ทั้งหมดของคุณ.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or asset ID..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canManage && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>เพิ่มครุภัณฑ์ชิ่นใหม่</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new asset to the inventory.
                </DialogDescription>
              </DialogHeader>
              <EquipmentForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {loading ? (
        <div className="border rounded-lg p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
       ) : <EquipmentTable data={filteredEquipment} onDataChange={fetchEquipment} user={user} />}
    </div>
  );
}
