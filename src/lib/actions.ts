
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, documentId } from 'firebase/firestore';
import type { EquipmentItem, EquipmentSet, User, UserRole } from './types';
import { getAdminApp } from './firebase-admin';
import { auth as adminAuth, firestore as adminFirestore } from 'firebase-admin';
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

        if (sets.length === 0) {
            return [];
        }

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

export const getUser = cache(async (): Promise<User | null> => {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        return null;
    }

    try {
        const app = getAdminApp();
        const auth = adminAuth(app);
        const firestore = adminFirestore(app);

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userDoc = await firestore.collection('users').doc(decodedClaims.uid).get();

        if (!userDoc.exists) {
            // This case can happen if the user is deleted from Firestore but not from Auth.
            return null;
        }

        const userData = userDoc.data();
        
        return {
          id: decodedClaims.uid,
          name: userData?.name || 'No Name',
          email: userData?.email || '',
          avatar: userData?.avatar || 'https://placehold.co/100x100.png',
          role: (userData?.role as UserRole) || 'guest',
        };
    } catch (error) {
        // Session cookie is invalid or expired.
        console.error("Error verifying session cookie or fetching user data:", error);
        return null;
    }
});


export async function getUsers(): Promise<User[]> {
    try {
        const app = getAdminApp();
        const firestore = adminFirestore(app);
        const usersSnapshot = await firestore.collection('users').get();
        
        if (usersSnapshot.empty) {
            return [];
        }

        const auth = adminAuth(app);
        const allAuthUsers = await auth.listUsers();
        const authUserMap = new Map(allAuthUsers.users.map(u => [u.uid, u]));

        const users: User[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            const authUser = authUserMap.get(doc.id);
            return {
                id: doc.id,
                name: data.name || authUser?.displayName || 'No Name',
                email: data.email || authUser?.email || '',
                avatar: data.avatar || authUser?.photoURL || 'https://placehold.co/100x100.png',
                role: (data.role as UserRole) || 'guest',
            };
        });

        return users;

    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function updateUserRole(userId: string, role: UserRole) {
    const currentUser = await getUser();
    if (currentUser?.role !== 'admin') {
        return { success: false, error: 'You do not have permission to perform this action.' };
    }
    if (currentUser?.id === userId) {
        return { success: false, error: 'Admins cannot change their own role.' };
    }

    try {
        const app = getAdminApp();
        const auth = adminAuth(app);
        const firestore = adminFirestore(app);

        // Set custom claims for Auth
        await auth.setCustomUserClaims(userId, { role });

        // Update role in Firestore
        const userDocRef = firestore.collection("users").doc(userId);
        await userDocRef.update({ role: role });
        
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (error) {
        console.error('Error updating user role:', error);
        return { success: false, error: 'Failed to update user role.' };
    }
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

export async function signOut() {
    cookies().delete('session');
    redirect('/login');
}

export async function signUp(values: z.infer<typeof signUpSchema>) {
    const validatedFields = signUpSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: "Invalid fields." };
    }

    const { email, password, name } = validatedFields.data;

    try {
        const app = getAdminApp();
        const auth = adminAuth(app);
        const firestore = adminFirestore(app);

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        const initialRole = 'auditor';

        // This sets the role in Firebase Authentication's custom claims.
        await auth.setCustomUserClaims(userRecord.uid, { role: initialRole });

        // This creates a corresponding user document in Firestore.
        const userDocRef = firestore.collection("users").doc(userRecord.uid);
        await userDocRef.set({
            name: name,
            email: email,
            role: initialRole,
            avatar: 'https://placehold.co/100x100.png',
            createdAt: new Date().toISOString(),
        });

        return { success: true, userId: userRecord.uid };
    } catch (error: any) {
        console.error("Firebase SignUp Error:", error.code, error.message);
        let errorMessage = "An unexpected error occurred.";
        if (error.code === 'auth/email-already-exists') {
            errorMessage = "This email is already in use by another account.";
        } else if (error.code === 'auth/invalid-password') {
            errorMessage = "The password is not strong enough.";
        } else if (error.code) {
            errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }

    