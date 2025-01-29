"use client"

import * as React from "react"
import {
  Bird,
  Map,
  Table2,
  Earth
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarAppBrand } from "@/components/sidebar-appbrand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from '@/components/auth-provider';

// This is sample data.
const data = {
  /*user: {
    name: "shadcn",
    email: "exemple@mail.com",
    avatar: "/avatars/shadcn.jpg",
  },*/
  app: [
    {
      name: "Ornitools",
      logo: Bird,
      plan: "CEN Normandie",
    },
  ],
  navMain: [
    {
      title: "Navigation",
      url: "#",
      icon: Earth,
      isActive: true,
      items: [
        {
          title: "Accueil",
          url: "/dashboard",
        },
        {
          title: "Page publique",
          url: "/",
        }
      ],
    },
    {
      title: "Données",
      url: "#",
      icon: Table2,
      isActive: true,
      items: [
        {
          title: "Oiseaux",
          url: "/bird",
        },
        {
          title: "Espèces",
          url: "/species",
        },
        {
          title: "Balises GPS",
          url: "/gps_device",
        },
      ],
    },
    {
      title: "Analyses",
      url: "#",
      icon: Map,
      isActive: true,
      items: [
        {
          title: "Carte",
          url: "/route_map",
        },

      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    console.log('User:', user);
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarAppBrand app={data.app} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
