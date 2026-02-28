import { z } from 'zod';

export const equipmentFormSchema = z.object({
  assetId: z.string().min(1, { message: 'กรุณากรอกหมายเลขครุภัณฑ์' }),
  name: z.string().min(2, { message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' }),
  model: z.string().min(2, { message: 'รุ่นต้องมีอย่างน้อย 2 ตัวอักษร' }),
  status: z.enum(['USABLE', 'BROKEN', 'LOST']),
  location: z.string().min(2, 'กรุณาระบุสถานที่'),
  purchaseDate: z.date(),
  notes: z.string().optional(),
  setId: z.string().optional(),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

export const setFormSchema = z.object({
  name: z.string().min(2, { message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' }),
  location: z.string().min(2, 'กรุณาระบุสถานที่'),
});

export type SetFormValues = z.infer<typeof setFormSchema>;

export const signUpSchema = z.object({
  name: z.string().min(2, { message: 'กรุณากรอกชื่อ' }),
  email: z.string().email({ message: 'กรุณากรอกอีเมลที่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email({ message: 'กรุณากรอกอีเมลที่ถูกต้อง' }),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
