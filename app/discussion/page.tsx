import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import NewThreadForm from './NewThreadForm';
import type { Thread } from '@/lib/types';

export default async function DiscussionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: threads } = await supabase
    .from('threads')
    .select('*, profiles(display_name), replies(count)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-700 text-3xl sm:text-4xl mb-2">Zeldin titi</h1>
        <p className="text-slate max-w-xl">
          Zawhna nei tan, titi a tan theih e, in tanpui tawn theuh ang u khai...
        </p>
      </div>

      {user ? (
        <NewThreadForm />
      ) : (
        <div className="border border-dashed border-ink/20 rounded-sm p-4 mb-8 text-sm text-slate">
          <Link href="/login" className="text-pine font-medium hover:underline">
            Sign in
          </Link>{' '}
          phawt a ngai aw!
        </div>
      )}

      <div className="divide-y divide-ink/10 border-t border-b border-ink/10 mt-8">
        {!threads || threads.length === 0 ? (
          <p className="text-slate py-8 text-center">Titi kal engmah a la awm lo ve — post hmasa ber tu han ni teh le.</p>
        ) : (
          (threads as any[]).map((thread) => (
            <Link
              key={thread.id}
              href={`/discussion/${thread.id}`}
              className="flex items-center justify-between py-4 hover:bg-ink/[0.03] transition-colors px-2 -mx-2"
            >
              <div>
                <h2 className="font-medium">{thread.title}</h2>
                <p className="text-xs text-slate font-mono mt-0.5">
                  {thread.profiles?.display_name ?? 'Someone'} ·{' '}
                  {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="font-mono text-xs text-slate shrink-0 ml-4">
                {thread.replies?.[0]?.count ?? 0} replies
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
