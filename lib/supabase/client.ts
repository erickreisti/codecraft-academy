import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gyarobrsaodtkhilrtru.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YXJvYnJzYW9kdGtoaWxydHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjMxOTUsImV4cCI6MjA3NTMzOTE5NX0.cNKDrQaqWh4EAuZiXxj6BYFTwHRUFpsKvDgcQzcrphk";

export const supabase = createClient(supabaseUrl, supabaseKey);
