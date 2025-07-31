
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, documentId } from 'firebase/firestore';
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

// Helper to convert Firestore snapshot to EquipmentItem
const fromSnapshotToEquipmentItem = (snapshot: any): EquipmentItem => {
    const data = snapshot.data();
    return {
        ...data,
        id: snapshot.id,
        // Convert Firestore Timestamp to ISO string
        purchaseDate: data.purchaseDate.toDate().toISOString(),
    };
};

export async function getEquipmentItems(): Promise<EquipmentItem[]> {
    try {
        const q = query(collection(db, "equipment"), orderBy("purchaseDate", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(fromSnapshotToEquipmentItem);
    } catch (error: any) {
        console.error('Firestore Error getting equipment items:', error.message);
        return [];
    }
}

export async function getEquipmentItemById(id: string): Promise<EquipmentItem | null> {
    try {
        const docRef = doc(db, "equipment", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return fromSnapshotToEquipmentItem(docSnap);
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error: any) {
        console.error(`Firestore Error getting equipment by ID ${id}:`, error.message);
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
        setId: formData.get('setId') === 'none' ? '' : formData.get('setId'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }

    try {
        await addDoc(collection(db, "equipment"), validatedFields.data);
    } catch (error: any) {
        console.error('Firestore Error saving equipment:', error.message);
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
        setId: formData.get('setId') === 'none' ? '' : formData.get('setId'),
    });

    if (!validatedFields.success) {
       console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
       throw new Error("Validation failed");
    }
    
    try {
        const docRef = doc(db, "equipment", id);
        await updateDoc(docRef, validatedFields.data as any);
    } catch (error: any) {
        console.error('Firestore Error updating equipment:', error.message);
        throw new Error('Failed to update equipment item.');
    }

    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
    redirect('/dashboard/equipment');
}

export async function deleteEquipment(id: string) {
    try {
        await deleteDoc(doc(db, "equipment", id));
    } catch (error: any) {
        console.error('Firestore Error deleting equipment:', error.message);
        throw new Error('Failed to delete equipment item.');
    }
    revalidatePath('/dashboard/equipment');
    redirect('/dashboard/equipment');
}


export async function getDashboardStats() {
    try {
        const equipmentCollection = collection(db, "equipment");
        
        const totalPromise = getDocs(equipmentCollection).then(snap => snap.size);
        const usablePromise = getDocs(query(equipmentCollection, where("status", "==", "usable"))).then(snap => snap.size);
        const brokenPromise = getDocs(query(equipmentCollection, where("status", "==", "broken"))).then(snap => snap.size);
        const lostPromise = getDocs(query(equipmentCollection, where("status", "==", "lost"))).then(snap => snap.size);

        const [total, usable, broken, lost] = await Promise.all([totalPromise, usablePromise, brokenPromise, lostPromise]);

        return { total, usable, broken, lost, error: null };
    } catch (error: any) {
        console.error('Firestore Error getting dashboard stats:', error.message);
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
        const q = query(collection(db, "equipment"), orderBy("purchaseDate", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(fromSnapshotToEquipmentItem);
    } catch (error: any) {
        console.error('Firestore Error getting recent activity:', error.message);
        return [];
    }
}

export async function getEquipmentSets(): Promise<EquipmentSet[]> {
    try {
        const setsCollection = collection(db, "equipment_sets");
        const setsSnapshot = await getDocs(setsCollection);
        const sets = setsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as EquipmentSet[];

        const allItemsSnapshot = await getDocs(collection(db, "equipment"));
        const allItems = allItemsSnapshot.docs.map(fromSnapshotToEquipmentItem);

        return sets.map(set => ({
            ...set,
            items: allItems.filter(item => item.setId === set.id)
        }));
    } catch (error: any) {
        console.error('Firestore Error getting equipment sets:', error.message);
        return [];
    }
}


export async function getUser(): Promise<User> {
    // This is a mock user. In a real app, you'd use Firebase Auth.
    return {
        name: 'Guest User',
        email: 'guest@example.com',
        avatar: 'https://placehold.co/100x100.png',
    };
}

export async function getSetOptions(): Promise<{ id: string, name: string }[]> {
    try {
        const setsCollection = collection(db, "equipment_sets");
        const q = query(setsCollection, orderBy("name"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string }));
    } catch (error: any) {
        console.error('Firestore Error getting set options:', error.message);
        return [];
    }
}
