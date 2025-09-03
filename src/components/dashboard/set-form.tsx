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
import { useToast } from "@/hooks/use-toast"
import type { EquipmentSet } from "@/lib/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  onSuccess?: () => void;
}

export function SetForm({ defaultValues, isEditing = false, onSuccess }: SetFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      location: defaultValues?.location || '',
    },
  })

  async function onSubmit(values: SetFormValues) {
    try {
      if (isEditing && defaultValues?.id) {
        // TODO: Implement update functionality
        toast({
          title: "Set Updated (Not Implemented)",
          description: `The set "${values.name}" has been successfully updated.`,
        });
      } else {
        await addDoc(collection(db, "equipment_sets"), values);
        toast({
          title: "Set Created",
          description: `The set "${values.name}" has been successfully created.`,
        });
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving set:", error);
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
            <Button type="button" variant="outline" onClick={onSuccess}>
                Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating...' : (isEditing ? 'Save Changes' : 'Create Set')}
            </Button>
        </div>
      </form>
    </Form>
  )
}
