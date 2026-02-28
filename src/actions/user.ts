'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { signUpSchema, type SignUpFormValues } from '@/lib/schemas';
import { Role } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission((session?.user as any)?.role as Role, 'MANAGE_USERS')) {
      throw new Error('Unauthorized');
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, targetRole: Role) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission((session?.user as any)?.role as Role, 'MANAGE_USERS')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการแก้ไขผู้ใช้งาน (Unauthorized)' };
    }

    // Protection to not allow modifying the currently logged in user's role to prevent locking themselves out
    if (session?.user?.id === userId) {
        return { success: false, error: 'ไม่สามารถปรับเปลี่ยนสิทธิ์ของตนเองได้' }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole },
    });
    
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error) {
    logger.error('Failed to update user role:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!hasPermission((session?.user as any)?.role as Role, 'MANAGE_USERS')) {
       return { success: false, error: 'คุณไม่มีสิทธิ์ในการลบผู้ใช้งาน (Unauthorized)' };
    }

    if (session?.user?.id === userId) {
        return { success: false, error: 'ไม่สามารถลบบัญชีของตนเองได้' }
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    
    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete user:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' };
  }
}

export async function registerUser(values: SignUpFormValues) {
  try {
    const validated = signUpSchema.parse(values);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: 'อีเมลนี้มีผู้ใช้งานแล้ว' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to register user:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการสร้างบัญชีผู้ใช้' };
  }
}
