import type { EquipmentItem, EquipmentStatus } from '@/lib/types';

/**
 * แปลงข้อมูล Prisma Equipment record → EquipmentItem (serialized)
 * ใช้ร่วมกันระหว่าง Server Actions ทุกไฟล์
 */
export function toEquipmentItem(record: any): EquipmentItem {
  return {
    id: record.id,
    assetId: record.assetId,
    name: record.name,
    model: record.model,
    status: record.status as EquipmentStatus,
    location: record.location,
    purchaseDate: record.purchaseDate.toISOString(),
    notes: record.notes,
    setId: record.setId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
