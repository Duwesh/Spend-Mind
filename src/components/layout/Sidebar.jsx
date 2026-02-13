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
  ];

  return (
    <div
      className={cn(
        "w-64 bg-[#020617] border-r border-slate-800 h-screen flex flex-col p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-10 px-2 pl-2">
        <div className="bg-cyan-400 p-1.5 rounded-lg">
          <Wallet className="h-5 w-5 text-slate-950" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
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
                  "flex items-center w-full justify-start gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-cyan-400/10 text-cyan-400 font-semibold border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
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

      <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
        {/* Bottom Section */}
        <div className="flex items-center gap-3 px-2 py-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
          <Avatar className="h-9 w-9 border-2 border-slate-800">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-slate-800 text-slate-300">
              {user?.user_metadata?.full_name?.charAt(0) ||
                user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.user_metadata?.full_name || "User Name"}
            </p>
            <p className="text-[10px] text-emerald-500 font-medium">
              Premium Member
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
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
                className="text-slate-500 hover:text-white gap-2 px-2 hover:bg-slate-800/50"
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
              className="bg-slate-900 border-slate-800 text-slate-300"
            >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[10px] text-slate-600 font-medium">v1.2.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
