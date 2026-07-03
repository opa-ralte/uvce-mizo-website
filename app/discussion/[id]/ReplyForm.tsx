'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('replies').insert({
      thread_id: threadId,
      author_id: user.id,
      body,
    });

    setBody('');
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a reply…"
        className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-paper px-4 py-2 rounded-sm text-sm font-medium hover:bg-pine transition-colors disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Reply'}
      </button>
    </form>
  );
}
