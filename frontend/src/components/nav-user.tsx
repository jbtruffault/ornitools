'use client';

import {
  ChevronsUpDown,
  LogOut,
  CircleUserRound,
  Settings 
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/use-auth';

export function NavUser({
  user,
}: {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    //avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const logout = useLogout();

  const handleLogout = async () => {
    await logout
      .mutateAsync()
      .then(() => {
        console.log('Logout successful');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {
                //<AvatarImage src={user.avatar} alt={user.first_name} />
                }
                <AvatarFallback className="rounded-lg">
                  <CircleUserRound/>
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {`${user.first_name} ${user.last_name.toUpperCase()}`}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {
                  //<AvatarImage src={user.avatar} alt={user.first_name} />
                  }
                  <AvatarFallback className="rounded-lg">
                    <CircleUserRound/>
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  <span className="truncate font-semibold">
                    {`${user.first_name} ${user.last_name.toUpperCase()}`}
                  </span>
                </span>
                  <span className="truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Settings />
              <a href="/me">
                <span>Paramètres</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              <LogOut />
              {logout.isPending ? 'Logging out...' : 'Déconnexion'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
