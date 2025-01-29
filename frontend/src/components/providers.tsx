'use client';

import { Refine } from "@refinedev/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { authProvider, AuthContextProvider } from "./auth-provider";
import { dataProvider } from "./data-provider";
import routerProvider from "@refinedev/nextjs-router";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthContextProvider>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            resources={[
              {
                name: "species",
                list: "/species",
                create: "/species/create",
                edit: "/species/edit/:id",
                show: "/species/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "bird",
                list: "/bird",
                create: "/bird/create",
                edit: "/bird/edit/:id",
                show: "/bird/show/:id",
                meta: { canDelete: true },
              },
              {
                name: "gps_device",
                list: "/gps_device",
                create: "/gps_device/create",
                edit: "/gps_device/edit/:id",
                show: "/gps_device/show/:id",
                meta: { canDelete: true },
              },
            ]}
          >
            {children}
          </Refine>
        </AuthContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
