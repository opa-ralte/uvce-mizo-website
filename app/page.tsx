import { createClient } from '@/lib/supabase/server';
import PinnedCard from '@/components/PinnedCard';
import type { Post } from '@/lib/types';

export default async function BoardPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display font-700 text-3xl sm:text-4xl mb-2">Heiha huiha</h1>
        <p className="text-slate max-w-xl">
          Thuchhuah, thlalak(hlimthla) leh documents UVCE-a lut te tana hriat tur pawimawh ho...
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="border border-dashed border-ink/20 rounded-sm p-10 text-center text-slate">
          Nothing&apos;s pinned up yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(posts as Post[]).map((post, i) => (
            <PinnedCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
