export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  duration_hours: number;
  level: "iniciante" | "intermediario" | "avancado";
  category: string;
  image_url: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  published_at: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};
