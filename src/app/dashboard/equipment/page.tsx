
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { EquipmentTable } from "@/components/dashboard/equipment-table";
import { getEquipmentItems, getUser } from "@/lib/actions";
import { useState, useEffect } from "react";
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

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchEquipmentAndUser = async () => {
    setLoading(true);
    const itemsPromise = getEquipmentItems();
    const userPromise = getUser();
    const [items, userData] = await Promise.all([itemsPromise, userPromise]);
    setEquipment(items);
    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipmentAndUser();
  }, []);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchEquipmentAndUser(); // Refresh data
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">รายการครุภัณฑ์</h1>
        <p className="text-muted-foreground">จัดการครุภัณฑ์ทั้งหมดของคุณ.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search equipment..." className="pl-10" />
        </div>
        {user?.role === 'admin' && (
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
      
      {loading ? <p>Loading equipment...</p> : <EquipmentTable data={equipment} onDataChange={fetchEquipmentAndUser} user={user} />}
    </div>
  );
}
