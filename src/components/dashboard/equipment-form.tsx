
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { EquipmentItem } from "@/lib/types"
import { getSetOptions, saveEquipment, updateEquipment } from "@/lib/actions"
import { useEffect, useState } from "react";

const formSchema = z.object({
  assetId: z.string().min(1, { message: "Asset ID is required." }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }),
  status: z.enum(["usable", "broken", "lost"]),
  location: z.string().min(2, "Location is required."),
  purchaseDate: z.date(),
  notes: z.string().optional(),
  setId: z.string().optional(),
})

type EquipmentFormValues = z.infer<typeof formSchema>

interface EquipmentFormProps {
  defaultValues?: Partial<EquipmentItem>;
  isEditing?: boolean;
}

export function EquipmentForm({ defaultValues, isEditing = false }: EquipmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [setOptions, setSetOptions] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    async function fetchSetOptions() {
      const options = await getSetOptions();
      setSetOptions(options);
    }
    fetchSetOptions();
  }, []);
  
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetId: defaultValues?.assetId || '',
      name: defaultValues?.name || '',
      model: defaultValues?.model || '',
      status: defaultValues?.status || 'usable',
      location: defaultValues?.location || '',
      notes: defaultValues?.notes || '',
      setId: defaultValues?.setId || '',
      purchaseDate: defaultValues?.purchaseDate ? new Date(defaultValues.purchaseDate) : new Date(),
    },
  })

  async function onSubmit(values: EquipmentFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    try {
      if (isEditing && defaultValues?.id) {
        await updateEquipment(defaultValues.id, formData);
        toast({
          title: "Equipment Updated",
          description: `The equipment "${values.name}" has been successfully updated.`,
        });
      } else {
        await saveEquipment(formData);
        toast({
          title: "Equipment Added",
          description: `The equipment "${values.name}" has been successfully saved.`,
        });
      }
      // Redirect is handled by server action
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error saving the equipment. Please try again.`,
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
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมายเลขครุภัณฑ์</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., COM-00123" {...field} />
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
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dell Laptop" {...field} />
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
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Latitude 5420" {...field} />
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
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usable">Usable</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Lab A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Date</FormLabel>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                <FormLabel>Equipment Set (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a set" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="none">-- No Set --</SelectItem>
                        {setOptions.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.name} ({option.id})
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
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any relevant notes about the asset..."
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
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Equipment'}</Button>
        </div>
      </form>
    </Form>
  )
}
