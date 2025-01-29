'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContextProvider, useAuth } from '@/components/auth-provider';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BreadcrumbProvider, useBreadcrumbs } from '@/components/breadcrumb-provider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toaster } from "@/components/ui/toaster";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname to get the current pathname
  const { breadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader breadcrumbs={breadcrumbs} />
          <div className="flex h-full items-center justify-center pt-4">
            <div className="">
              <LoadingSpinner />
            </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 pt-0 ">
            {children}
            <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <BreadcrumbProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </BreadcrumbProvider>
    </AuthContextProvider>
  );
}
