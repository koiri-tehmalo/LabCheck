import type { EquipmentItem, EquipmentSet, User } from '@/lib/types';

export const mockUser: User = {
  name: 'Admin User',
  email: 'admin@asset-tracker.com',
  avatar: 'https://placehold.co/100x100.png',
};

export const mockEquipmentItems: EquipmentItem[] = [
  {
    id: 'ASSET-001',
    name: 'Dell Latitude 5420',
    model: 'Latitude 5420',
    purchaseDate: '2023-01-15',
    status: 'usable',
    location: 'Lab A',
    qrCodeUrl: '/qr/ASSET-001.png',
    setId: 'SET-01',
  },
  {
    id: 'ASSET-002',
    name: 'Dell 24" Monitor',
    model: 'P2422H',
    purchaseDate: '2023-01-15',
    status: 'usable',
    location: 'Lab A',
    qrCodeUrl: '/qr/ASSET-002.png',
    setId: 'SET-01',
  },
  {
    id: 'ASSET-003',
    name: 'Logitech Mouse',
    model: 'M185',
    purchaseDate: '2023-01-15',
    status: 'broken',
    location: 'Lab A',
    qrCodeUrl: '/qr/ASSET-003.png',
    setId: 'SET-01',
    notes: 'Scroll wheel is not working.',
  },
  {
    id: 'ASSET-004',
    name: 'Logitech Keyboard',
    model: 'K120',
    purchaseDate: '2023-01-15',
    status: 'usable',
    location: 'Lab A',
    qrCodeUrl: '/qr/ASSET-004.png',
    setId: 'SET-01',
  },
  {
    id: 'ASSET-005',
    name: 'HP EliteBook 840',
    model: 'EliteBook 840 G8',
    purchaseDate: '2022-11-20',
    status: 'lost',
    location: 'Lab B',
    qrCodeUrl: '/qr/ASSET-005.png',
    notes: 'Last seen with John Doe on 2023-12-01.',
  },
  {
    id: 'ASSET-006',
    name: 'Cisco Catalyst 2960',
    model: 'WS-C2960-24TC-L',
    purchaseDate: '2021-05-10',
    status: 'usable',
    location: 'Server Room',
    qrCodeUrl: '/qr/ASSET-006.png',
  },
  {
    id: 'ASSET-007',
    name: 'Epson Projector',
    model: 'PowerLite 1781W',
    purchaseDate: '2023-02-28',
    status: 'usable',
    location: 'Meeting Room 1',
    qrCodeUrl: '/qr/ASSET-007.png',
  },
];

export const mockEquipmentSets: EquipmentSet[] = [
  {
    id: 'SET-01',
    name: 'Dev Workstation 01',
    location: 'Lab A',
    items: mockEquipmentItems.filter(item => item.setId === 'SET-01'),
  },
  {
    id: 'SET-02',
    name: 'Dev Workstation 02',
    location: 'Lab B',
    items: [
        {
            id: 'ASSET-008',
            name: 'Lenovo ThinkPad T14',
            model: 'ThinkPad T14 Gen 2',
            purchaseDate: '2023-03-10',
            status: 'usable',
            location: 'Lab B',
            setId: 'SET-02',
        },
        {
            id: 'ASSET-009',
            name: 'Lenovo 24" Monitor',
            model: 'ThinkVision T24i-20',
            purchaseDate: '2023-03-10',
            status: 'usable',
            location: 'Lab B',
            setId: 'SET-02',
        },
    ],
  },
];
