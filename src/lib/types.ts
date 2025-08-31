
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type EquipmentStatus = 'usable' | 'broken' | 'lost';

export type EquipmentItem = {
  id: string; // Firestore document ID
  assetId: string; // User-defined asset ID
  name: string;
  model: string;
  purchaseDate: string; // Stored as ISO string
  status: EquipmentStatus;
  location: string;
  notes?: string;
  setId?: string;
};

export type EquipmentSet = {
  id: string;
  name: string;
  items?: EquipmentItem[];
  location: string;
};
