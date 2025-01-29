import Link from 'next/link';
import React from 'react';
import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ThemeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { SidebarTrigger } from './ui/sidebar';

interface BreadcrumbProps {
  route: string;
  name: string;
}

export function SiteHeader({ breadcrumbs = [] }: { breadcrumbs: BreadcrumbProps[] }) {
  // Limit the breadcrumb list to 4 elements if necessary, default to Home if empty
  const breadcrumbLinks = breadcrumbs.length > 0 ? breadcrumbs.slice(0, 4) : [{ route: '/dashboard', name: 'Accueil' }];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbLinks.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.route}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={breadcrumb.route}>
                    {breadcrumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbLinks.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 items-center justify-end space-x-4 pr-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
