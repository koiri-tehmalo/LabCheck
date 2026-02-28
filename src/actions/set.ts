'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { setFormSchema } from '@/lib/schemas';
import type { EquipmentSet } from '@/lib/types';
import { toEquipmentItem } from '@/lib/helpers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { Role } from '@/lib/types';

export async function getEquipmentSets(): Promise<EquipmentSet[]> {
  try {
    const sets = await prisma.equipmentSet.findMany({
      include: { items: true },
      orderBy: { name: 'asc' },
    });
    return sets.map((set: any) => ({
      id: set.id,
      name: set.name,
      location: set.location,
      items: set.items.map(toEquipmentItem),
    }));
  } catch (error) {
    logger.error('Failed to fetch equipment sets:', error);
    return [];
  }
}

export async function getSetOptions(): Promise<{ id: string; name: string }[]> {
  try {
    const sets = await prisma.equipmentSet.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    return sets;
  } catch (error) {
    logger.error('Failed to fetch set options:', error);
    return [];
  }
}

export async function createEquipmentSet(data: { name: string; location: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission(session?.user?.role as Role, 'MANAGE_SETS')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการสร้างชุดครุภัณฑ์ (Unauthorized)' };
    }

    const validated = setFormSchema.parse(data);
    await prisma.equipmentSet.create({ data: validated });
    revalidatePath('/dashboard/sets');
    return { success: true };
  } catch (error) {
    logger.error('Failed to create equipment set:', error);
    return { success: false, error: 'ไม่สามารถสร้างชุดครุภัณฑ์ได้ กรุณาลองใหม่อีกครั้ง' };
  }
}
