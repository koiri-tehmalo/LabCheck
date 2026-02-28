export type EquipmentStatus = 'USABLE' | 'BROKEN' | 'LOST';

export type Role = 'ADMIN' | 'STAFF';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
};

export type EquipmentItem = {
  id: string;
  assetId: string;
  name: string;
  model: string;
  purchaseDate: string;
  status: EquipmentStatus;
  location: string;
  notes: string | null;
  setId: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type EquipmentSet = {
  id: string;
  name: string;
  location: string;
  items?: EquipmentItem[];
};

export type DashboardStats = {
  total: number;
  usable: number;
  broken: number;
  lost: number;
};
