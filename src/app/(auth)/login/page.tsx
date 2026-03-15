import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const authOrigin = process.env.NEXT_PUBLIC_AUTH_ORIGIN;
  if (authOrigin) {
    redirect(`${authOrigin}/login`);
  }
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}
