import Image from 'next/image';
import type { Post } from '@/lib/types';

const ROTATIONS = ['-rotate-1.5', 'rotate-1', '-rotate-2.5', 'rotate-2', 'rotate-1.5'];

export default function PinnedCard({ post, index }: { post: Post; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`pin relative bg-white border border-ink/10 rounded-sm shadow-md p-5 ${rotation} hover:rotate-0 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-display font-600 text-lg leading-snug pr-2">{post.title}</h3>
        <span className="font-mono text-[11px] text-slate shrink-0 mt-1">{date}</span>
      </div>

      {post.photo_url && (
        <div className="relative w-full aspect-[4/3] mb-3 border-4 border-white shadow-sm bg-ink/5 -rotate-1">
          <Image
            src={post.photo_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        </div>
      )}

      <p className="text-sm text-ink/80 whitespace-pre-wrap mb-3">{post.body}</p>

      {post.doc_url && (
        <a
          href={post.doc_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide bg-chalk/40 px-2.5 py-1 rounded-sm hover:bg-chalk transition-colors"
        >
          📎 {post.doc_label || 'View document'}
        </a>
      )}

      <p className="font-mono text-[11px] text-slate mt-3">
        — {post.profiles?.display_name ?? 'Admin'}
      </p>
    </div>
  );
}
