import {
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  LogOut,
  PieChart,
  BarChart,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NavLink } from "react-router-dom";

const Sidebar = ({ className, onNavigate }) => {
  const { setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      id: "transactions",
      label: "Expenses",
      icon: Receipt,
      path: "/expenses",
    },
    { id: "budgets", label: "Budgets", icon: PieChart, path: "/budgets" },
    { id: "reports", label: "Reports", icon: BarChart, path: "/reports" },
    {
      id: "ai-advisor",
      label: "AI Advisor",
      icon: Sparkles,
      path: "/ai-advisor",
    },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    {
      id: "subscription",
      label: "Subscription",
      icon: CreditCard,
      path: "/subscription",
    },
  ];

  return (
    <div
      className={cn(
        "w-64 bg-card border-r border-border h-screen flex flex-col p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-10 px-2 pl-2">
        <div className="bg-cyan-500 text-white p-1.5 rounded-lg shadow-sm">
          <Wallet className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          SpendMind
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center w-full justify-start gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )
              }
            >
              <Icon className={cn("h-4 w-4", "transition-colors")} />
              <span className="flex-1">{item.label}</span>
              {item.id === "dashboard" && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 hidden group-[.active]:block" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border space-y-4">
        {/* Bottom Section */}
        <div className="flex items-center gap-3 px-2 py-3 bg-accent/30 rounded-xl border border-border/50">
          <Avatar className="h-9 w-9 border-2 border-border transition-transform hover:scale-105">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
              {user?.user_metadata?.full_name?.charAt(0) ||
                user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 px-1">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.user_metadata?.full_name || "User Name"}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
              Premium Member
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between px-2 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2 px-2 hover:bg-accent/50 transition-colors"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                <span className="text-xs font-medium">Appearance</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-popover border-border text-popover-foreground shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer"
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="cursor-pointer"
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            v1.2.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
