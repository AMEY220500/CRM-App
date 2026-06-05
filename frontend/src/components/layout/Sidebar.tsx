import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  ArrowLeftRight,
  Settings,
  Package2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Customers", href: "/customers", icon: UserCircle },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Stock", href: "/stock", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center space-x-2">
            <Package2 className="h-6 w-6 text-primary shrink-0" />
            {!collapsed && <span className="font-bold text-lg">CRM Pro</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function useSidebarWidth() {
  return "ml-64"; // Default non-collapsed
}
