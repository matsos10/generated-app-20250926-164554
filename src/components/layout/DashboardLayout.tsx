import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../DashboardSidebar';
import { DashboardHeader } from '../DashboardHeader';
import { Toaster } from '@/components/ui/sonner';
export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar isCollapsed={isCollapsed} />
      <div className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'sm:pl-20' : 'sm:pl-64'}`}>
        <DashboardHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
      <Toaster richColors />
    </div>
  );
}