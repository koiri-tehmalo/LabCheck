'use client';

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, QrCode } from 'lucide-react';
import type { EquipmentItem, User } from '@/lib/types';
import { StatusBadge } from './status-badge';
import Link from 'next/link';
import { hasPermission } from '@/lib/permissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentForm } from "@/components/dashboard/equipment-form";

type EquipmentTableProps = {
  data: EquipmentItem[];
  onDataChange: () => void;
  user: User | null;
};

export function EquipmentTable({ data, onDataChange, user }: EquipmentTableProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);

  const handleEditClick = (item: EquipmentItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    onDataChange();
  };

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingItem(null);
  }

  const canManage = hasPermission(user?.role, 'UPDATE_EQUIPMENT');

  return (
    <>
      <div className="glass-card">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead>หมายเลขครุภัณฑ์</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="hidden md:table-cell">สถานที่</TableHead>
              <TableHead className="hidden sm:table-cell">วันที่จัดซื้อ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  ไม่พบครุภัณฑ์
                </TableCell>
              </TableRow>
            ) : (
            data.map((item) => (
              <TableRow key={item.id} className="border-border/30 glass-row">
                <TableCell className="font-medium">{item.assetId}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/equipment/${item.id}`} className="hover:text-[hsl(230,80%,70%)] transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-xs text-muted-foreground hidden sm:block">{item.model}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString('th-TH')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <span className="sr-only">เปิดเมนู</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                         <Link href={`/dashboard/equipment/${item.id}`} className="flex items-center">
                          <QrCode className="mr-2 h-4 w-4" /> ดูรายละเอียด
                         </Link>
                      </DropdownMenuItem>
                      {canManage && (
                        <>
                          <DropdownMenuItem onClick={() => handleEditClick(item)} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" /> แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/equipment/${item.id}/delete`} className="flex items-center text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> ลบ
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[625px] glass-elevated border-border/40">
          <DialogHeader>
            <DialogTitle>แก้ไขครุภัณฑ์</DialogTitle>
            <DialogDescription>
                แก้ไขข้อมูลครุภัณฑ์หมายเลข <span className="font-mono bg-[hsl(230,80%,62%,0.15)] text-[hsl(230,80%,70%)] px-1.5 py-0.5 rounded">{editingItem?.assetId}</span>
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <EquipmentForm
              defaultValues={editingItem}
              isEditing={true}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
