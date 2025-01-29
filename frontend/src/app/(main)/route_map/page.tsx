'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import * as React from "react";

// Dynamically import RouteMap_LandingPage with no SSR: avoid webpack error "ReferenceError: window is not defined"
const DynamicRouteMap = dynamic(() => import('@/components/map/route-map').then(mod => mod.RouteMap), { ssr: false });


export default function AuthenticatedMap() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();

  // Set breadcrumbs on load
  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/route_map', name: 'Carte' },
    ]);
  }, [setBreadcrumbs]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  return (
      <DynamicRouteMap/>
  );
}
