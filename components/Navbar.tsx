import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    isAdmin = !!profile?.is_admin;
  }

  return (
    <header className="border-b-2 border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-700 text-xl tracking-tight">
          UVCE Mizo
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-pine transition-colors">
            Hlimthla
          </Link>
          <Link href="/discussion" className="hover:text-pine transition-colors">
            Zeldin titi
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 bg-chalk text-ink rounded-sm font-mono text-xs uppercase tracking-wide -rotate-1.5 shadow-sm hover:rotate-0 transition-transform"
            >
              Post
            </Link>
          )}
          {user ? (
            <form action="/api/auth/signout" method="post">
              <button className="text-slate hover:text-coral transition-colors" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="text-slate hover:text-pine transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
