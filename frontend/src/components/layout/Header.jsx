import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6">
      <div className="flex flex-1 items-center justify-between">
        <div />

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="text-sm font-medium">Low stock alert</span>
                <span className="text-xs text-muted-foreground">
                  Wireless Mouse is below minimum stock level
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="text-sm font-medium">New employee added</span>
                <span className="text-xs text-muted-foreground">
                  Sarah Johnson joined the Engineering team
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="text-sm font-medium">
                  Customer status update
                </span>
                <span className="text-xs text-muted-foreground">
                  Acme Corp moved from lead to active
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {user?.role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
