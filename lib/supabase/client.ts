import { createClient } from "@supabase/supabase-js";
// Importa função para criar cliente Supabase

const supabaseUrl = "https://gyarobrsaodtkhilrtru.supabase.co";
// URL da instância do Supabase

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YXJvYnJzYW9kdGtoaWxydHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjMxOTUsImV4cCI6MjA3NTMzOTE5NX0.cNKDrQaqWh4EAuZiXxj6BYFTwHRUFpsKvDgcQzcrphk";
// Chave pública anônima para autenticação (segura para uso no cliente)

export const supabase = createClient(supabaseUrl, supabaseKey);
// Exporta instância do cliente Supabase configurada
