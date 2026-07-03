'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewThreadForm() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('threads')
      .insert({ author_id: user.id, title, body })
      .select()
      .single();

    setSubmitting(false);
    if (!error && data) {
      router.push(`/discussion/${data.id}`);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-ink text-paper px-4 py-2 rounded-sm text-sm font-medium hover:bg-pine transition-colors"
      >
        + Start a thread
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink/10 rounded-sm p-5 bg-white shadow-sm space-y-3">
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thread title"
        className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
      />
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="What's on your mind?"
        className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-chalk text-ink px-4 py-2 rounded-sm text-sm font-medium hover:bg-coral hover:text-white transition-colors disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post thread'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm text-slate hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
