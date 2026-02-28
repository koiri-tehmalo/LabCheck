'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { EquipmentSet } from "@/lib/types";
import { createEquipmentSet } from '@/actions/set';
import { setFormSchema, type SetFormValues } from '@/lib/schemas';

interface SetFormProps {
  defaultValues?: Partial<EquipmentSet>;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function SetForm({ defaultValues, isEditing = false, onSuccess }: SetFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SetFormValues>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      location: defaultValues?.location || '',
    },
  })

  async function onSubmit(values: SetFormValues) {
    const result = await createEquipmentSet(values);

    if (result.success) {
      toast({
        title: isEditing ? "แก้ไขชุดครุภัณฑ์สำเร็จ" : "สร้างชุดครุภัณฑ์สำเร็จ",
        description: `ชุดครุภัณฑ์ "${values.name}" ได้รับการบันทึกแล้ว`,
      });
      if (onSuccess) onSuccess();
    } else {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อชุดครุภัณฑ์</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น ชุดห้องประชุม A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานที่</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น อาคาร 1 ห้อง 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onSuccess}>
                ยกเลิก
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'สร้างชุดครุภัณฑ์')}
            </Button>
        </div>
      </form>
    </Form>
  )
}
