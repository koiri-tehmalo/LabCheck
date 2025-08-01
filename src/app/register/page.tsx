
import { HardDrive } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from './_components/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
            <HardDrive className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Enter your details below to get started.</p>
        </div>
        
        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
