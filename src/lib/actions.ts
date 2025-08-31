
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db, auth as clientAuth, storage } from './firebase'; // Import client-side auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, documentId, setDoc } from 'firebase/firestore';
import type { EquipmentItem, EquipmentSet, User, EquipmentStatus } from './types';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Schema for form validation
const equipmentFormSchema = z.object({
  assetId: z.string().min(1, { message: "Asset ID is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  model: z.string().min(2, { message: "Model must be at least 2 characters." }),
  status: z.enum(["usable", "broken", "lost"]),
  location: z.string().min(2, "Location is required."),
  purchaseDate: z.date(),
  notes: z.string().optional(),
  setId: z.string().optional(),
});

const setFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  location: z.string().min(2, "Location is required."),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});


// Helper to convert Firestore snapshot to EquipmentItem
const fromSnapshotToEquipmentItem = (snapshot: any): EquipmentItem => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        // The rest of the data from Firestore
        ...data,
        // Convert Firestore Timestamp to ISO string for client-side usage
        purchaseDate: data.purchaseDate.toDate().toISOString(),
    } as EquipmentItem;
};


export async function saveEquipment(formData: FormData) {
    const rawData = {
        assetId: formData.get('assetId'),
        name: formData.get('name'),
        model: formData.get('model'),
        status: formData.get('status'),
        location: formData.get('location'),
        purchaseDate: new Date(formData.get('purchaseDate') as string),
        notes: formData.get('notes'),
        setId: formData.get('setId'),
    };
    
    const validatedFields = equipmentFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }
    
    const dataToSave = {
        ...validatedFields.data,
        notes: validatedFields.data.notes || '',
        setId: validatedFields.data.setId === 'none' ? '' : validatedFields.data.setId,
    };


    try {
        await addDoc(collection(db, "equipment"), dataToSave);
    } catch (error: any) {
        console.error('Firestore Error saving equipment:', error.message);
        throw new Error('Failed to create equipment item.');
    }

    revalidatePath('/dashboard/equipment');
}

export async function updateEquipment(id: string, formData: FormData) {
     const rawData = {
        assetId: formData.get('assetId'),
        name: formData.get('name'),
        model: formData.get('model'),
        status: formData.get('status'),
        location: formData.get('location'),
        purchaseDate: new Date(formData.get('purchaseDate') as string),
        notes: formData.get('notes'),
        setId: formData.get('setId'),
    };

     const validatedFields = equipmentFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
       console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
       throw new Error("Validation failed");
    }
    
    const dataToUpdate = {
        ...validatedFields.data,
        notes: validatedFields.data.notes || '',
        setId: validatedFields.data.setId === 'none' ? '' : validatedFields.data.setId
    };
    
    try {
        const docRef = doc(db, "equipment", id);
        await updateDoc(docRef, dataToUpdate as any);
    } catch (error: any) {
        console.error('Firestore Error updating equipment:', error.message);
        throw new Error('Failed to update equipment item.');
    }

    revalidatePath('/dashboard/equipment');
    revalidatePath(`/dashboard/equipment/${id}`);
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


export async function saveEquipmentSet(formData: FormData) {
    const validatedFields = setFormSchema.safeParse({
        name: formData.get('name'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
        throw new Error("Validation failed");
    }

    try {
        await addDoc(collection(db, "equipment_sets"), validatedFields.data);
    } catch (error: any) {
        console.error('Firestore Error saving equipment set:', error.message);
        throw new Error('Failed to create equipment set.');
    }

    revalidatePath('/dashboard/sets');
}

export async function signOut() {
    cookies().delete('session'); 
    revalidatePath('/', 'layout');
    redirect('/login');
}


export async function signUp(values: z.infer<typeof signUpSchema>) {
     return { success: true };
}

export async function signInWithEmail(values: z.infer<typeof signInSchema>) {
    try {
        const validatedFields = signInSchema.safeParse(values);
        if (!validatedFields.success) {
            return { success: false, error: "Invalid email or password format." };
        }
        
        const { email, password } = validatedFields.data;
        const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
        const idToken = await userCredential.user.getIdToken();

        return { success: true, idToken };
    } catch (error: any) {
        let errorMessage = "An unknown error occurred.";
        if (error.code) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                default:
                    errorMessage = 'An unexpected error occurred during sign-in.';
                    break;
            }
        }
        console.error('Sign In Error:', error);
        return { success: false, error: errorMessage };
    }
}

export async function updateUserAvatar(formData: FormData) {
  const file = formData.get('avatar') as File | null;
  if (!file) {
    throw new Error('No file uploaded');
  }
   console.warn("updateUserAvatar is disabled because it requires the Admin SDK.");
  
  revalidatePath('/', 'layout');
  return { success: false, error: "Avatar update is disabled." };
}

export async function createUserDocument(userId: string, name: string, email: string) {
    try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, {
            name: name,
            email: email,
            avatar: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
            createdAt: new Date().toISOString(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating user document:", error);
        return { success: false, error: "Failed to create user profile." };
    }
}

export async function updateEquipmentStatus(id: string, status: EquipmentStatus) {
    const statusSchema = z.enum(['usable', 'broken', 'lost']);
    const validatedStatus = statusSchema.safeParse(status);

    if (!validatedStatus.success) {
        console.error('Validation errors:', validatedStatus.error.flatten().fieldErrors);
        return { success: false, error: 'Invalid status provided.' };
    }

    try {
        const docRef = doc(db, "equipment", id);
        await updateDoc(docRef, { status: validatedStatus.data });
        revalidatePath(`/dashboard/equipment/${id}`);
        revalidatePath(`/dashboard`);
        revalidatePath(`/dashboard/equipment`);
        return { success: true };
    } catch (error: any) {
        console.error('Firestore Error updating status:', error.message);
        return { success: false, error: 'Failed to update status.' };
    }
}
