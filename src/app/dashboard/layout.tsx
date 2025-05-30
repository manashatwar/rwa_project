"use client";

import { Suspense } from "react";
import EnhancedSidebar, {
  SidebarProvider,
  useSidebar,
} from "../../components/enhanced-sidebar";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar />

      {/* Main Content - Responsive to sidebar state with proper centering */}
      <div
        className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-16" : "ml-64"
        } min-w-0`}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="w-full min-h-full">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
