'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import type { EquipmentSet } from "@/lib/types";
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
import { getEquipmentSets } from '@/actions/set';
import { hasPermission } from '@/lib/permissions';

export default function SetsPage() {
  const [sets, setSets] = useState<EquipmentSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSets = async () => {
    setLoading(true);
    const data = await getEquipmentSets();
    setSets(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
        fetchSets();
    }
  }, [authLoading]);

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    fetchSets();
  };
  
  const canManage = hasPermission(user?.role, 'MANAGE_SETS');

  const filteredSets = useMemo(() => {
    if (!searchTerm) return sets;
    return sets.filter(set =>
      set.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sets, searchTerm]);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ชุดครุภัณฑ์</h1>
          <p className="text-muted-foreground">จัดการกลุ่มครุภัณฑ์ที่เกี่ยวข้องกัน</p>
        </div>
        {canManage && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto btn-gradient border-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                สร้างชุดครุภัณฑ์
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] glass-elevated border-border/40">
                <DialogHeader>
                <DialogTitle>สร้างชุดครุภัณฑ์ใหม่</DialogTitle>
                <DialogDescription>
                    กรอกข้อมูลด้านล่างเพื่อสร้างชุดครุภัณฑ์ใหม่
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
            placeholder="ค้นหาด้วยชื่อชุดครุภัณฑ์..." 
            className="pl-10 glass-input" 
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
              <Card key={set.id} className="glass-card border-border/40">
                <CardHeader>
                  <CardTitle>{set.name}</CardTitle>
                  <CardDescription>สถานที่: {set.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="text-sm font-medium">รายการในชุดนี้:</h4>
                  <Separator />
                   {set.items && set.items.length > 0 ? (
                    <ul className="space-y-3">
                      {set.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <Link href={`/dashboard/equipment/${item.id}`} className="hover:text-[hsl(230,80%,70%)] transition-colors">
                            {item.name}
                          </Link>
                          <StatusBadge status={item.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">ไม่มีรายการในชุดนี้</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredSets.length === 0 && !loading && (
            <Card className="glass-card border-border/40">
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-medium text-muted-foreground">ไม่พบชุดครุภัณฑ์</h3>
                <p className="text-sm text-muted-foreground mt-2">สร้างชุดใหม่หรือปรับคำค้นหา</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
