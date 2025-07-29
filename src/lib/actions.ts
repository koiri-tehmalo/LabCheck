
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { query } from './db';
import type { EquipmentItem } from './types';

// Schema for form validation
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  model: z.string().min(2, { message: "Model must be at least 2 characters." }),
  status: z.enum(["usable", "broken", "lost"]),
  location: z.string().min(2, "Location is required."),
  purchaseDate: z.date(),
  notes: z.string().optional(),
  setId: z.string().optional(),
});

export async function getEquipmentItems(): Promise<EquipmentItem[]> {
    try {
        const results = await query("SELECT * FROM equipment_items ORDER BY purchaseDate DESC", []) as any[];
        // Convert date objects to string to ensure serializability
        return results.map(item => ({
            ...item,
            purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch equipment items.');
    }
}

export async function getEquipmentItemById(id: string): Promise<EquipmentItem | null> {
    try {
        const results = await query("SELECT * FROM equipment_items WHERE id = ?", [id]) as any[];
        if (results.length === 0) {
            return null;
        }
        const item = results[0];
        // Convert date objects to string to ensure serializability
        return {
            ...item,
            purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
        };
    } catch (error) {
        console.error('Database Error:', error);
        // Don't throw, return null if not found or on error
        return null;
    }
}


export async function saveEquipment(formData: FormData) {
    const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        model: formData.get('model'),
        status: formData.get('status'),
        location: formData.get('location'),
        purchaseDate: new Date(formData.get('purchaseDate') as string),
        notes: formData.get('notes'),
        setId: formData.get('setId'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }

    const { name, model, status, location, purchaseDate, notes, setId } = validatedFields.data;
    const dateString = purchaseDate.toISOString().split('T')[0];
    const newId = `ASSET-${Date.now().toString().slice(-6)}`;

    try {
        await query(
            'INSERT INTO equipment_items (id, name, model, status, location, purchaseDate, notes, setId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [newId, name, model, status, location, dateString, notes || null, setId || null]
        );
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create equipment item.');
    }

    revalidatePath('/dashboard/equipment');
    redirect('/dashboard/equipment');
}

export async function updateEquipment(id: string, formData: FormData) {
     const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        model: formData.get('model'),
        status: formData.get('status'),
        location: formData.get('location'),
        purchaseDate: new Date(formData.get('purchaseDate') as string),
        notes: formData.get('notes'),
        setId: formData.get('setId'),
    });

    if (!validatedFields.success) {
       console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
       throw new Error("Validation failed");
    }

    const { name, model, status, location, purchaseDate, notes, setId } = validatedFields.data;
    const dateString = purchaseDate.toISOString().split('T')[0];
    
    try {
        await query(
            'UPDATE equipment_items SET name = ?, model = ?, status = ?, location = ?, purchaseDate = ?, notes = ?, setId = ? WHERE id = ?',
            [name, model, status, location, dateString, notes || null, setId || null, id]
        );
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update equipment item.');
    }

    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
    redirect('/dashboard/equipment');
}

export async function deleteEquipment(id: string) {
    try {
        await query('DELETE FROM equipment_items WHERE id = ?', [id]);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete equipment item.');
    }
    revalidatePath('/dashboard/equipment');
    redirect('/dashboard/equipment');
}

// You can add similar functions for users and equipment_sets later
export async function getDashboardStats() {
    try {
        const totalResult = await query("SELECT COUNT(*) as count FROM equipment_items", []) as any[];
        const usableResult = await query("SELECT COUNT(*) as count FROM equipment_items WHERE status = 'usable'", []) as any[];
        const brokenResult = await query("SELECT COUNT(*) as count FROM equipment_items WHERE status = 'broken'", []) as any[];
        const lostResult = await query("SELECT COUNT(*) as count FROM equipment_items WHERE status = 'lost'", []) as any[];

        return {
            total: totalResult[0].count,
            usable: usableResult[0].count,
            broken: brokenResult[0].count,
            lost: lostResult[0].count,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch dashboard stats.');
    }
}

export async function getRecentActivity(): Promise<EquipmentItem[]> {
    try {
        const results = await query("SELECT * FROM equipment_items ORDER BY purchaseDate DESC LIMIT 5", []) as any[];
        return results.map(item => ({
            ...item,
            purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch recent activity.');
    }
}
