"use client";
import { UserCircle, LogOut, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get user data
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 1).toUpperCase();
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/sign-in")}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg"
        >
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">
              {getUserInitials()}
            </span>
          </div>

          {/* User Name - Hidden on mobile */}
          <span className="hidden md:block text-sm font-medium text-gray-900">
            {getUserDisplayName()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {getUserDisplayName()}
            </span>
            <span className="text-xs text-gray-500 font-normal">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <User className="w-4 h-4 mr-2" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
          }}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
