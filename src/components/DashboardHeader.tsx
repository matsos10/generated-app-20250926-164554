import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UserNav } from './UserNav';
import { DashboardSidebar } from './DashboardSidebar';
interface DashboardHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}
export function DashboardHeader({ isCollapsed, setIsCollapsed }: DashboardHeaderProps) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <DashboardSidebar isCollapsed={false} />
        </SheetContent>
      </Sheet>
      <Button
        variant="outline"
        size="icon"
        className="hidden md:inline-flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
      </Button>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.slice(1).map((value, index) => {
            const to = `/${pathnames.slice(0, index + 2).join('/')}`;
            const isLast = index === pathnames.length - 2;
            return (
              <BreadcrumbItem key={to}>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{value}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to} className="capitalize">{value}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}