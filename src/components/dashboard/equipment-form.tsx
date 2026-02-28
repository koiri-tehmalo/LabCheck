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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import type { EquipmentItem } from "@/lib/types"
import { useEffect, useState } from "react";
import { createEquipment, updateEquipment } from '@/actions/equipment';
import { getSetOptions } from '@/actions/set';
import { equipmentFormSchema, type EquipmentFormValues } from '@/lib/schemas';

interface EquipmentFormProps {
  defaultValues?: Partial<EquipmentItem>;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function EquipmentForm({ defaultValues, isEditing = false, onSuccess }: EquipmentFormProps) {
  const { toast } = useToast();
  const [setOptionsList, setSetOptionsList] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    async function fetchSetOptions() {
      const options = await getSetOptions();
      setSetOptionsList(options);
    }
    fetchSetOptions();
  }, []);
  
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      assetId: defaultValues?.assetId || '',
      name: defaultValues?.name || '',
      model: defaultValues?.model || '',
      status: defaultValues?.status || 'USABLE',
      location: defaultValues?.location || '',
      notes: defaultValues?.notes || '',
      setId: defaultValues?.setId || '',
      purchaseDate: defaultValues?.purchaseDate ? new Date(defaultValues.purchaseDate) : new Date(),
    },
  })

  async function onSubmit(values: EquipmentFormValues) {
    const result = isEditing && defaultValues?.id
      ? await updateEquipment(defaultValues.id, values)
      : await createEquipment(values);

    if (result.success) {
      toast({
        title: isEditing ? "แก้ไขครุภัณฑ์สำเร็จ" : "เพิ่มครุภัณฑ์สำเร็จ",
        description: `ครุภัณฑ์ "${values.name}" ได้รับการบันทึกแล้ว`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมายเลขครุภัณฑ์</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น COM-00123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อครุภัณฑ์</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น คอมพิวเตอร์ Dell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รุ่น</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น Latitude 5420" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USABLE">ใช้งานได้</SelectItem>
                    <SelectItem value="BROKEN">ชำรุด</SelectItem>
                    <SelectItem value="LOST">สูญหาย</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="เช่น ห้องปฏิบัติการ A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>วันที่จัดซื้อ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: th })
                        ) : (
                          <span>เลือกวันที่</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="setId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชุดครุภัณฑ์ (ไม่บังคับ)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="เลือกชุดครุภัณฑ์" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="none">-- ไม่มี --</SelectItem>
                        {setOptionsList.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
             <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเหตุ (ไม่บังคับ)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="บันทึกข้อมูลเพิ่มเติมเกี่ยวกับครุภัณฑ์..."
                        className="resize-none"
                        {...field}
                         value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onSuccess}>
                ยกเลิก
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (isEditing ? 'กำลังบันทึก...' : 'กำลังเพิ่ม...') : (isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มครุภัณฑ์')}
            </Button>
        </div>
      </form>
    </Form>
  )
}
