'use server';

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import type { DashboardStats, EquipmentItem } from '@/lib/types';
import { toEquipmentItem } from '@/lib/helpers';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [total, usable, broken, lost] = await Promise.all([
      prisma.equipment.count(),
      prisma.equipment.count({ where: { status: 'USABLE' } }),
      prisma.equipment.count({ where: { status: 'BROKEN' } }),
      prisma.equipment.count({ where: { status: 'LOST' } }),
    ]);
    return { total, usable, broken, lost };
  } catch (error) {
    logger.error('Failed to get dashboard stats:', error);
    return { total: 0, usable: 0, broken: 0, lost: 0 };
  }
}

export async function getRecentActivity(count = 5): Promise<EquipmentItem[]> {
  try {
    const records = await prisma.equipment.findMany({
      orderBy: { purchaseDate: 'desc' },
      take: count,
    });
    return records.map(toEquipmentItem);
  } catch (error) {
    logger.error('Failed to get recent activity:', error);
    return [];
  }
}
