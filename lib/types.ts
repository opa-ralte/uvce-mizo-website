export type Profile = {
  id: string;
  display_name: string;
  is_admin: boolean;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  body: string;
  photo_url: string | null;
  doc_url: string | null;
  doc_label: string | null;
  created_at: string;
  profiles?: Profile;
};

export type Thread = {
  id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
  profiles?: Profile;
  reply_count?: number;
};

export type Reply = {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: Profile;
};
