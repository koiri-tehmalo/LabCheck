import { LoginForm } from '@/components/auth/login-form';
import { HardDrive } from 'lucide-react';

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </main>
  );
}
