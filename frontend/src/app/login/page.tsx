import { LoginForm, GuestRoute } from '@/features/auth';

export default function LoginPage() {
  return (
    <GuestRoute>
      <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#050505]">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
        </div>

        <LoginForm />
      </main>
    </GuestRoute>
  );
}
