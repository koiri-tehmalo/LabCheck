
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
    onDataChange(); // Refresh data in the parent component
  };

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingItem(null);
  }

  const canManage = !!user;

  return (
    <>
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หมายเลขครุภัณฑ์</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden sm:table-cell">Purchase Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.assetId}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/equipment/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                  <div className="text-xs text-muted-foreground hidden sm:block">{item.model}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                         <Link href={`/dashboard/equipment/${item.id}`} className="flex items-center">
                          <QrCode className="mr-2 h-4 w-4" /> View Details & QR
                         </Link>
                      </DropdownMenuItem>
                      {canManage && (
                        <>
                          <DropdownMenuItem onClick={() => handleEditClick(item)} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/equipment/${item.id}/delete`} className="flex items-center text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>
                Update the details for asset <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{editingItem?.assetId}</span>.
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
