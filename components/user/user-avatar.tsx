// components/user/user-avatar.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function UserAvatar({ size = "md", showName = false }: UserAvatarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    };

    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-muted animate-pulse`}
      ></div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center`}
      >
        <span className="text-muted-foreground">?</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary/20`}
          onError={(e) => {
            // Fallback para inicial se a imagem falhar
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-primary/20`}
        >
          {profile?.full_name?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            "U"}
        </div>
      )}

      {showName && (
        <span className="text-sm text-muted-foreground">
          {profile?.full_name || user?.email?.split("@")[0] || "Usuário"}
        </span>
      )}
    </div>
  );
}
