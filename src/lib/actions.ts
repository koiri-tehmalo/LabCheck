'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db, auth as clientAuth, storage } from './firebase'; // Import client-side auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, documentId, setDoc } from 'firebase/firestore';
import type { EquipmentItem, EquipmentSet, User, UserRole } from './types';
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

// NOTE: All get... functions are being removed as they will be executed on the client.
// export async function getEquipmentItems(): Promise<EquipmentItem[]> { ... }
// export async function getEquipmentItemById(id: string): Promise<EquipmentItem | null> { ... }
// export async function getDashboardStats() { ... }
// export async function getRecentActivity(): Promise<EquipmentItem[]> { ... }
// export async function getEquipmentSets(): Promise<EquipmentSet[]> { ... }
// export async function getSetOptions(): Promise<{ id: string, name: string }[]> { ... }

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

// REMOVED getUser, getUsers, updateUserRole as they require Admin SDK.
// User state will be managed on the client.


export async function signOut() {
    // This server action is now primarily for redirecting.
    // The actual sign out happens on the client.
    cookies().delete('session'); // Keep for good measure, though not used for auth state
    revalidatePath('/', 'layout');
    redirect('/login');
}


export async function signUp(values: z.infer<typeof signUpSchema>) {
    // This function can no longer be a server action as it uses the client SDK.
    // It is kept here for reference but the implementation will be in the component.
    // The actual implementation is moved to the register-form.tsx component.
    // We're returning a success to avoid breaking the form, but the real logic is on the client.
     return { success: true };
}


// This function must be called from a Client Component or a Server Action
// but it uses the client SDK. We can't use the Admin SDK to sign in a user.
export async function signInWithEmail(values: z.infer<typeof signInSchema>) {
    try {
        const validatedFields = signInSchema.safeParse(values);
        if (!validatedFields.success) {
            return { success: false, error: "Invalid email or password format." };
        }
        
        const { email, password } = validatedFields.data;
        // This part is problematic in a server action. The actual sign-in will be client-side.
        // We leave this function here but the client will handle sign-in directly.
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
 // This function cannot work without the Admin SDK to get a stable download URL
 // and update the user's auth profile. It's left here but will not function correctly.
  const file = formData.get('avatar') as File | null;
  if (!file) {
    throw new Error('No file uploaded');
  }
   console.warn("updateUserAvatar is disabled because it requires the Admin SDK.");
  
  revalidatePath('/', 'layout');
  return { success: false, error: "Avatar update is disabled." };
}

// NEW FUNCTION: To create a user document in Firestore after client-side registration
export async function createUserDocument(userId: string, name: string, email: string) {
    try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, {
            name: name,
            email: email,
            role: 'guest', // Default role for new users
            avatar: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
            createdAt: new Date().toISOString(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating user document:", error);
        return { success: false, error: "Failed to create user profile." };
    }
}
// Client-side data fetching functions that were previously in actions.ts
// These will be used in client components with hooks.
// It is better to co-locate these with the components, so we will not keep them here.
// But for reference, this is how you would fetch data on the client:

/*
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase'; // Make sure this points to your client-side firebase config

export async function getDashboardStatsClient() {
    // Implementation here
}
*/
