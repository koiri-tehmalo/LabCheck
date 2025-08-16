
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail } from "@/lib/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const result = await signInWithEmail(values);
    
    if (result.success && result.idToken) {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: result.idToken,
                credentials: 'include', // Ensure cookies are sent and received
            });

            if (response.ok) {
                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                });
                router.push('/');
                router.refresh(); // Force a refresh to update layout with user data
            } else {
                 toast({
                    title: "Login Failed",
                    description: "Could not create session. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Login Failed",
                description: "An unexpected error occurred while creating the session.",
                variant: "destructive",
            });
        }
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "An unknown error occurred. Please check your credentials.",
        variant: "destructive",
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
            <HardDrive className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Asset Tracker</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Please sign in to continue.</p>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>
        </Form>

        <Separator className="my-6" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

    
