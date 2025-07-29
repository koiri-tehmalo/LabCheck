
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { query } from './db';
import type { EquipmentItem, EquipmentSet, User } from './types';

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
    } catch (error: any) {
        console.error('Database Error getting equipment items:', error.message);
        // Return empty array on error to prevent crash
        return [];
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
    } catch (error: any) {
        console.error(`Database Error getting equipment by ID ${id}:`, error.message);
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
    } catch (error: any) {
        console.error('Database Error saving equipment:', error.message);
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
    } catch (error: any) {
        console.error('Database Error updating equipment:', error.message);
        throw new Error('Failed to update equipment item.');
    }

    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
    redirect('/dashboard/equipment');
}

export async function deleteEquipment(id: string) {
    try {
        await query('DELETE FROM equipment_items WHERE id = ?', [id]);
    } catch (error: any) {
        console.error('Database Error deleting equipment:', error.message);
        throw new Error('Failed to delete equipment item.');
    }
    revalidatePath('/dashboard/equipment');
    redirect('/dashboard/equipment');
}


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
            error: null,
        };
    } catch (error: any) {
        console.error('Database Connection Error:', error.message);
        return {
            total: 0,
            usable: 0,
            broken: 0,
            lost: 0,
            error: `Failed to connect to the database. Please check your configuration. (${error.code})`,
        }
    }
}

export async function getRecentActivity(): Promise<EquipmentItem[]> {
    try {
        const results = await query("SELECT * FROM equipment_items ORDER BY purchaseDate DESC LIMIT 5", []) as any[];
        return results.map(item => ({
            ...item,
            purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
        }));
    } catch (error: any) {
        console.error('Database Error getting recent activity:', error.message);
        return [];
    }
}

export async function getEquipmentSets(): Promise<EquipmentSet[]> {
    try {
        const sets = await query("SELECT * FROM equipment_sets", []) as any[];
        const items = await query("SELECT * FROM equipment_items", []) as any[];

        return sets.map(set => ({
            ...set,
            items: items.filter(item => item.setId === set.id)
                         .map(item => ({...item, purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0]}))
        }));
    } catch (error: any) {
        console.error('Database Error getting equipment sets:', error.message);
        return [];
    }
}

export async function getUser(): Promise<User> {
    try {
        // In a real app, you would fetch the logged-in user
        const users = await query("SELECT * FROM users LIMIT 1", []) as any[];
        if (users.length > 0) {
            return users[0];
        }
    } catch (error: any) {
        console.error('Database Error getting user:', error.message);
    }
    // Return a default user if no user is found or if there's an error
    return {
        name: 'Guest User',
        email: 'guest@example.com',
        avatar: 'https://placehold.co/100x100.png',
    };
}
