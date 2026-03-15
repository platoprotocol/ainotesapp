import { redirect } from 'next/navigation';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  const authOrigin = process.env.NEXT_PUBLIC_AUTH_ORIGIN;
  if (authOrigin) {
    redirect(`${authOrigin}/signup`);
  }
  return <SignupForm />;
}
