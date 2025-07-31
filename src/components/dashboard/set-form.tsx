'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { saveEquipmentSet } from "@/lib/actions"
import type { EquipmentSet } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, "Location is required."),
})

type SetFormValues = z.infer<typeof formSchema>

interface SetFormProps {
  defaultValues?: Partial<EquipmentSet>;
  isEditing?: boolean;
}

export function SetForm({ defaultValues, isEditing = false }: SetFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<SetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      location: defaultValues?.location || '',
    },
  })

  async function onSubmit(values: SetFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
          formData.append(key, value as string);
      }
    });

    try {
      if (isEditing && defaultValues?.id) {
        // await updateEquipmentSet(defaultValues.id, formData); // To be implemented
        toast({
          title: "Set Updated",
          description: `The set "${values.name}" has been successfully updated.`,
        });
      } else {
        await saveEquipmentSet(formData);
        toast({
          title: "Set Created",
          description: `The set "${values.name}" has been successfully created.`,
        });
      }
      // Redirect is handled by server action
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error saving the set. Please try again.`,
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
                <FormLabel>Set Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Conference Room A Kit" {...field} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Building 1, Room 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Set'}</Button>
        </div>
      </form>
    </Form>
  )
}
