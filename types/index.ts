// types/index.ts

/**
 * TIPOS GLOBAIS - CodeCraft Academy
 *
 * Centraliza todas as interfaces e tipos TypeScript do projeto
 * Organizado por domínios: Cursos, Blog, Usuários, etc.
 */

// ===== DOMÍNIO: CURSOS =====
export interface Course {
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
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  completed: boolean;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
}

// ===== DOMÍNIO: BLOG =====
export interface BlogPost {
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
}

// ===== DOMÍNIO: USUÁRIOS =====
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// ===== DOMÍNIO: PEDIDOS/E-COMMERCE =====
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  course_id: string;
  price: number;
}

// ===== TIPOS DE FORMULÁRIOS =====
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// ===== TIPOS DE RESPOSTAS DA API =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===== TIPOS DE COMPONENTES =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// ===== TIPOS DE FILTROS =====
export interface CourseFilters {
  category?: string;
  level?: string;
  priceRange?: "free" | "paid";
  featured?: boolean;
}

export interface BlogFilters {
  category?: string;
  author?: string;
  publishedAfter?: string;
}

// ===== TIPOS DE ESTATÍSTICAS =====
export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
}

// ===== TIPOS DE UPLOAD =====
export interface FileUpload {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

// ===== TIPOS DE NOTIFICAÇÕES =====
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

// ===== TIPOS PARA CARRINHO =====
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  slug: string;
  quantity: number;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    courses: Pick<Course, "title" | "slug">;
  })[];
}

export interface CartCheckoutData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
}

// ===== TIPOS DE SUPABASE =====
export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Course, "id" | "created_at">>;
      };
      posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BlogPost, "id" | "created_at">>;
      };
      enrollments: {
        Row: CourseEnrollment;
        Insert: Omit<CourseEnrollment, "id" | "enrolled_at">;
        Update: Partial<Omit<CourseEnrollment, "id" | "enrolled_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      course_level: "iniciante" | "intermediario" | "avancado";
      order_status: "pending" | "completed" | "cancelled";
    };
  };
}
