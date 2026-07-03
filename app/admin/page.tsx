import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminPostForm from './AdminPostForm';

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <p className="text-slate">
          This page is for community admins only. If that should be you, ask an existing
          admin to flip your <code className="font-mono text-xs">is_admin</code> flag in
          Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display font-700 text-3xl mb-6">Pin something new</h1>
      <AdminPostForm />
    </div>
  );
}
