
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Dashboard, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const UserMenu: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
    navigate("/");
  };

  // Use email's first letter as fallback if no avatar image
  const initials =
    user.email?.[0]?.toUpperCase() ||
    user.user_metadata?.email?.[0]?.toUpperCase() ||
    user.id.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border shadow-md">
          <AvatarImage
            src={user.user_metadata?.avatar_url ?? undefined}
            alt={user.email ?? "User"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 mt-2">
        <div className="px-2 py-2 flex flex-col">
          <span className="text-xs font-semibold truncate">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Dashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

