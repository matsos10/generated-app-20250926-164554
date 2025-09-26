import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Settings, Wrench, BarChart2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
interface DashboardSidebarProps {
  isCollapsed: boolean;
}
export function DashboardSidebar({ isCollapsed }: DashboardSidebarProps) {
  const location = useLocation();
  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance' },
    { href: '/dashboard/scheduling', icon: BarChart2, label: 'Scheduling' },
    { href: '/dashboard/quality', icon: Bot, label: 'Quality AI' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];
  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-20 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Zap className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="text-lg font-display">NexusFlow</span>}
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    location.pathname === item.href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}