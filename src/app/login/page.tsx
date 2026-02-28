'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HardDrive } from 'lucide-react';
import Link from 'next/link';
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
import { signIn } from 'next-auth/react';
import { signInSchema, type SignInFormValues } from '@/lib/schemas';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "เข้าสู่ระบบสำเร็จ",
      description: "ยินดีต้อนรับกลับ!",
    });
    router.push('/');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 -m-4 md:-m-6 lg:-m-8">
      <div className="w-full max-w-sm">
        {/* Logo & Welcome */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(260,70%,55%)] rounded-2xl text-white mb-5 shadow-lg shadow-[hsl(230,80%,55%,0.35)]">
            <HardDrive className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tight">LabCheck</h1>
          <p className="text-muted-foreground mt-2 text-sm">ยินดีต้อนรับ! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        {/* Glass Form Card */}
        <div className="glass-elevated p-6">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel className="text-foreground/80 text-sm">อีเมล</FormLabel>
                      <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" className="glass-input" {...field} />
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
                  {form.formState.isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </Button>
              </form>
          </Form>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="font-semibold text-[hsl(230,80%,70%)] hover:text-[hsl(230,80%,80%)] transition-colors">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
