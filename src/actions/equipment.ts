'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { equipmentFormSchema } from '@/lib/schemas';
import type { EquipmentItem, EquipmentStatus } from '@/lib/types';
import { toEquipmentItem } from '@/lib/helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { Role } from '@/lib/types';



export async function getEquipmentItems(): Promise<EquipmentItem[]> {
  try {
    const records = await prisma.equipment.findMany({
      orderBy: { purchaseDate: 'desc' },
    });
    return records.map(toEquipmentItem);
  } catch (error) {
    logger.error('Failed to fetch equipment:', error);
    return [];
  }
}

export async function getEquipmentById(id: string): Promise<EquipmentItem | null> {
  try {
    const record = await prisma.equipment.findUnique({ where: { id } });
    if (!record) return null;
    return toEquipmentItem(record);
  } catch (error) {
    logger.error('Failed to fetch equipment by id:', error);
    return null;
  }
}

export async function createEquipment(data: {
  assetId: string;
  name: string;
  model: string;
  status: EquipmentStatus;
  location: string;
  purchaseDate: Date;
  notes?: string;
  setId?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission(session?.user?.role as Role, 'CREATE_EQUIPMENT')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการเพิ่มครุภัณฑ์ (Unauthorized)' };
    }

    const validated = equipmentFormSchema.parse(data);
    await prisma.equipment.create({
      data: {
        assetId: validated.assetId,
        name: validated.name,
        model: validated.model,
        status: validated.status,
        location: validated.location,
        purchaseDate: validated.purchaseDate,
        notes: validated.notes || null,
        setId: validated.setId === 'none' ? null : validated.setId || null,
      },
    });
    revalidatePath('/dashboard/equipment');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logger.error('Failed to create equipment:', error);
    return { success: false, error: 'ไม่สามารถเพิ่มครุภัณฑ์ได้ กรุณาลองใหม่อีกครั้ง' };
  }
}

export async function updateEquipment(id: string, data: {
  assetId: string;
  name: string;
  model: string;
  status: EquipmentStatus;
  location: string;
  purchaseDate: Date;
  notes?: string;
  setId?: string;
}) {
  try {
    const validated = equipmentFormSchema.parse(data);
    await prisma.equipment.update({
      where: { id },
      data: {
        assetId: validated.assetId,
        name: validated.name,
        model: validated.model,
        status: validated.status,
        location: validated.location,
        purchaseDate: validated.purchaseDate,
        notes: validated.notes || null,
        setId: validated.setId === 'none' ? null : validated.setId || null,
      },
    });
    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logger.error('Failed to update equipment:', error);
    return { success: false, error: 'ไม่สามารถแก้ไขครุภัณฑ์ได้ กรุณาลองใหม่อีกครั้ง' };
  }
}

export async function deleteEquipment(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission(session?.user?.role as Role, 'DELETE_EQUIPMENT')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการลบครุภัณฑ์ (Unauthorized)' };
    }

    await prisma.equipment.delete({ where: { id } });
    revalidatePath('/dashboard/equipment');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete equipment:', error);
    return { success: false, error: 'ไม่สามารถลบครุภัณฑ์ได้ กรุณาลองใหม่อีกครั้ง' };
  }
}

export async function updateEquipmentStatus(id: string, status: EquipmentStatus) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission(session?.user?.role as Role, 'UPDATE_EQUIPMENT')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการแก้ไขสถานะครุภัณฑ์ (Unauthorized)' };
    }

    await prisma.equipment.update({
      where: { id },
      data: { status },
    });
    revalidatePath(`/dashboard/equipment/${id}`);
    revalidatePath('/dashboard/equipment');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    logger.error('Failed to update equipment status:', error);
    return { success: false, error: 'ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง' };
  }
}
