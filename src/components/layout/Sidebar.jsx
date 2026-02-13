import {
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
  Moon,
  Sun,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NavLink } from "react-router-dom";

const Sidebar = ({ className, onNavigate }) => {
  const { setTheme } = useTheme();
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "ai-advisor", label: "AI Advisor", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "w-64 bg-card border-r h-screen flex flex-col p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-8 px-2 pl-4">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">SpendMind</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.id === "dashboard" ? "/" : `/${item.id}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center w-full justify-start gap-3 px-4 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t pt-4 space-y-4">
        <div className="px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-full justify-start px-4 gap-3 border-none shadow-none hover:bg-accent h-10"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 left-8" />
                <span className="font-medium ml-2">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="px-4 text-xs text-muted-foreground">v1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
