import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReplyForm from './ReplyForm';

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: thread } = await supabase
    .from('threads')
    .select('*, profiles(display_name)')
    .eq('id', params.id)
    .single();

  if (!thread) notFound();

  const { data: replies } = await supabase
    .from('replies')
    .select('*, profiles(display_name)')
    .eq('thread_id', params.id)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-700 text-2xl sm:text-3xl mb-2">{thread.title}</h1>
        <p className="text-xs text-slate font-mono mb-4">
          {thread.profiles?.display_name ?? 'Someone'} ·{' '}
          {new Date(thread.created_at).toLocaleDateString()}
        </p>
        <p className="whitespace-pre-wrap text-ink/90">{thread.body}</p>
      </div>

      <div className="border-t border-ink/10 pt-6 space-y-5">
        {(replies ?? []).map((reply: any) => (
          <div key={reply.id} className="border-l-2 border-chalk pl-4">
            <p className="text-xs text-slate font-mono mb-1">
              {reply.profiles?.display_name ?? 'Someone'} ·{' '}
              {new Date(reply.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm whitespace-pre-wrap">{reply.body}</p>
          </div>
        ))}
        {(!replies || replies.length === 0) && (
          <p className="text-slate text-sm">No replies yet.</p>
        )}
      </div>

      <div className="mt-8">
        {user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <p className="text-sm text-slate">Sign in to reply.</p>
        )}
      </div>
    </div>
  );
}
