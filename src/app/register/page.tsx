import { HardDrive } from 'lucide-react';
import Link from 'next/link';
import { RegisterForm } from './_components/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 -m-4 md:-m-6 lg:-m-8">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(260,70%,55%)] rounded-2xl text-white mb-5 shadow-lg shadow-[hsl(230,80%,55%,0.35)]">
            <HardDrive className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tight">สร้างบัญชี</h1>
          <p className="text-muted-foreground mt-2 text-sm">กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งาน</p>
        </div>

        {/* Glass Form Card */}
        <div className="glass-elevated p-6">
          <RegisterForm />
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="font-semibold text-[hsl(230,80%,70%)] hover:text-[hsl(230,80%,80%)] transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
