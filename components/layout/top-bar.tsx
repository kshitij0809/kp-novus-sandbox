"use client";

import { Search, HelpCircle, CreditCard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { NotificationsBell } from "./notifications-bell";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function TopBar() {
  const { user, signOut } = useAuthStore();
  const { openCommandPalette, toggleSidebar } = useUIStore();
  const router = useRouter();

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?";

  const handleSignOut = () => {
    signOut();
    router.push("/sign-in");
  };

  return (
    <header className="h-12 border-b border-border bg-background flex items-center px-4 gap-2 flex-shrink-0">
      <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={toggleSidebar}>
        <Menu size={16} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex-1 max-w-64 justify-start gap-2 text-muted-foreground h-8 text-sm"
        onClick={() => openCommandPalette()}
      >
        <Search size={14} />
        Search… <kbd className="ml-auto text-xs opacity-60">⌘K</kbd>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Link href="/help">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle size={16} />
          </Button>
        </Link>
        <Link href="/upgrade">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <CreditCard size={16} />
          </Button>
        </Link>
        <NotificationsBell />

        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-accent transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              Profile settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/billing")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
