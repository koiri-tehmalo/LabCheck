
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
