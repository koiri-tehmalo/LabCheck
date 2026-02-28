'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { EquipmentTable } from "@/components/dashboard/equipment-table";
import { useState, useEffect, useMemo } from "react";
import type { EquipmentItem } from "@/lib/types";
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
import { getEquipmentItems } from '@/actions/equipment';
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "@/lib/permissions";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    const items = await getEquipmentItems();
    setEquipment(items);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchEquipment();
    }
  }, [authLoading]);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchEquipment();
  };
  
  const canManage = hasPermission(user?.role, 'CREATE_EQUIPMENT');

  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipment;
    return equipment.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assetId && item.assetId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [equipment, searchTerm]);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">รายการครุภัณฑ์</h1>
        <p className="text-muted-foreground">จัดการครุภัณฑ์ทั้งหมดของคุณ</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ค้นหาด้วยชื่อหรือหมายเลขครุภัณฑ์..." 
            className="pl-10 glass-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canManage && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto btn-gradient border-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                เพิ่มครุภัณฑ์
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] glass-elevated border-border/40">
              <DialogHeader>
                <DialogTitle>เพิ่มครุภัณฑ์ชิ้นใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลด้านล่างเพื่อเพิ่มครุภัณฑ์ใหม่เข้าสู่ระบบ
                </DialogDescription>
              </DialogHeader>
              <EquipmentForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {loading ? (
        <div className="glass-card p-4">
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
