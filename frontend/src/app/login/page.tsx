import { LoginForm, GuestRoute } from '@/features/auth';

export default function LoginPage() {
  return (
    <GuestRoute>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <LoginForm />
      </main>
    </GuestRoute>
  );
}
