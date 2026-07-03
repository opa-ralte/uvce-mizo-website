-- ============================================================
-- Campus Hub database schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Profiles: one row per user, auto-created on signup
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Member',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Posts: admin-only announcements on "The Board"
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  photo_url text,
  doc_url text,
  doc_label text,
  created_at timestamptz not null default now()
);

-- Threads: forum discussion topics
create table threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Replies: forum replies within a thread
create table replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table posts enable row level security;
alter table threads enable row level security;
alter table replies enable row level security;

-- Profiles: everyone can read, users can only edit their own
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Posts: everyone can read (including guests), only admins can write
create policy "Posts are viewable by everyone"
  on posts for select using (true);

create policy "Only admins can insert posts"
  on posts for insert with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can update their posts"
  on posts for update using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can delete posts"
  on posts for delete using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Threads: everyone can read, only logged-in users can write
create policy "Threads are viewable by everyone"
  on threads for select using (true);

create policy "Logged-in users can create threads"
  on threads for insert with check (auth.uid() = author_id);

create policy "Authors can update their own threads"
  on threads for update using (auth.uid() = author_id);

create policy "Authors can delete their own threads"
  on threads for delete using (auth.uid() = author_id);

-- Replies: everyone can read, only logged-in users can write
create policy "Replies are viewable by everyone"
  on replies for select using (true);

create policy "Logged-in users can create replies"
  on replies for insert with check (auth.uid() = author_id);

create policy "Authors can update their own replies"
  on replies for update using (auth.uid() = author_id);

create policy "Authors can delete their own replies"
  on replies for delete using (auth.uid() = author_id);

-- ============================================================
-- Storage buckets (photos + documents)
-- Also create these two buckets manually in Dashboard → Storage,
-- set both to "Public bucket", then run the policies below.
-- ============================================================

insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

create policy "Public can view photos"
  on storage.objects for select using (bucket_id = 'photos');

create policy "Admins can upload photos"
  on storage.objects for insert with check (
    bucket_id = 'photos'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Public can view documents"
  on storage.objects for select using (bucket_id = 'documents');

create policy "Admins can upload documents"
  on storage.objects for insert with check (
    bucket_id = 'documents'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- Make yourself the first admin
-- After you sign in once through the site, run this (swap the email):
--
-- update profiles set is_admin = true
-- where id = (select id from auth.users where email = 'you@college.edu');
-- ============================================================
