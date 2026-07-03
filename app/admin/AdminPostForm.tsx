'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminPostForm() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [docLabel, setDocLabel] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function uploadFile(file: File, bucket: string) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      const photo_url = photoFile ? await uploadFile(photoFile, 'photos') : null;
      const doc_url = docFile ? await uploadFile(docFile, 'documents') : null;

      const { error: insertError } = await supabase.from('posts').insert({
        author_id: user.id,
        title,
        body,
        photo_url,
        doc_url,
        doc_label: docFile ? docLabel || docFile.name : null,
      });
      if (insertError) throw insertError;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-ink/10 rounded-sm shadow-md p-6">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
          Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
          placeholder="Club fair signups are open"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
          Details
        </label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
          Photo (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
          Document (optional)
        </label>
        <input
          type="file"
          onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm mb-2"
        />
        {docFile && (
          <input
            value={docLabel}
            onChange={(e) => setDocLabel(e.target.value)}
            placeholder="Label for this document (e.g. 'Event schedule.pdf')"
            className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
          />
        )}
      </div>

      {error && <p className="text-coral text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-chalk text-ink py-2.5 rounded-sm font-medium text-sm hover:bg-coral hover:text-white transition-colors disabled:opacity-50"
      >
        {submitting ? 'Pinning…' : 'Pin to the board'}
      </button>
    </form>
  );
}
