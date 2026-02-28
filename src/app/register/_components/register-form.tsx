'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { registerUser } from '@/actions/user';
import { signUpSchema, type SignUpFormValues } from '@/lib/schemas';

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    const result = await registerUser(values);

    if (!result.success) {
      toast({
        title: "สมัครสมาชิกไม่สำเร็จ",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "สร้างบัญชีสำเร็จ!",
      description: "คุณสามารถเข้าสู่ระบบได้แล้ว",
    });
    router.push('/login');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 text-sm">ชื่อ-นามสกุล</FormLabel>
              <FormControl>
                <Input placeholder="สมชาย ใจดี" className="glass-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 text-sm">อีเมล</FormLabel>
              <FormControl>
                <Input placeholder="somchai@example.com" className="glass-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80 text-sm">รหัสผ่าน</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className="glass-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full btn-gradient border-0 h-10 text-sm font-semibold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
        </Button>
      </form>
    </Form>
  );
}
