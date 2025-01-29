"use client"

import Link from 'next/link';
import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SidebarAppBrand({
  app,
}: {
  app: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {

  return (
    <SidebarMenu>
      {app.map((activeApp, index) => (
        <SidebarMenuItem key={index}>
          <Link href="/dashboard">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeApp.logo className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeApp.name}</span>
                <span className="truncate text-xs">{activeApp.plan}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}