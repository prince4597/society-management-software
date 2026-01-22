import { LoginForm, GuestRoute } from '@/features/auth';

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}
