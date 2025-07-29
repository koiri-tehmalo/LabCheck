export type User = {
  name: string;
  email: string;
  avatar: string;
};

export type EquipmentStatus = 'usable' | 'broken' | 'lost';

export type EquipmentItem = {
  id: string;
  name: string;
  model: string;
  purchaseDate: string;
  status: EquipmentStatus;
  qrCodeUrl?: string;
  location: string;
  notes?: string;
  setId?: string;
};

export type EquipmentSet = {
  id: string;
  name: string;
  items: EquipmentItem[];
  location: string;
};
