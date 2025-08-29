
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { EquipmentTable } from "@/components/dashboard/equipment-table";
import { getEquipmentItems } from "@/lib/actions";
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

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    const items = await getEquipmentItems();
    setEquipment(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchEquipment(); // Refresh data
  };
  
  // Role-based access is simplified as we no longer have reliable roles from the server.
  // We can just check if the user is logged in.
  const canManage = !!user;

  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipment;
    return equipment.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      {loading ? <p>Loading equipment...</p> : <EquipmentTable data={filteredEquipment} onDataChange={fetchEquipment} user={user} />}
    </div>
  );
}
