'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { display_name: name || email.split('@')[0] },
      },
    });
    setStatus(error ? 'error' : 'sent');
  }

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="relative bg-white border border-ink/10 rounded-sm shadow-md p-8 rotate-1">
        <h1 className="font-display font-700 text-2xl mb-1">Sign in</h1>
        <p className="text-slate text-sm mb-6">
          No password needed — we&apos;ll email you a link.
        </p>

        {status === 'sent' ? (
          <p className="text-pine text-sm">
            Check <span className="font-medium">{email}</span> for your sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-slate mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full border border-ink/15 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalk"
              />
            </div>
            {status === 'error' && (
              <p className="text-coral text-sm">Something went wrong. Try again.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-ink text-paper py-2.5 rounded-sm font-medium text-sm hover:bg-pine transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
