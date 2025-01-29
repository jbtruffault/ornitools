'use client';

import { useList } from "@refinedev/core";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import * as React from "react";

import { DataTable } from "@/components/ui/datatable";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Bird, columns } from "./components/bird-list-columns";

export default function BirdPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/bird', name: 'Oiseaux' },
    ]);
  }, [setBreadcrumbs]);

  // Change the type of the `list` state to `Bird[]` instead of `BaseRecord[]`
  const [list, setList] = useState<Bird[]>([]); // Correct type here
  const { data: birdData, isLoading: listLoading } = useList({ resource: "bird" });

  useEffect(() => {
    if (birdData) {
      // Ensure the data is typed as Bird[] by using type assertion
      setList(birdData.data as Bird[]); // Explicit type assertion
    }
  }, [birdData]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  // Render loading screen if data or authentication is loading
  if (authLoading || listLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className="container mx-auto py-10 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Oiseaux</h1>
        <Link href="/bird/create" className={cn(buttonVariants({ variant: 'outline' }),)}>
          <Plus size={16} />
        </Link>
      </div>

      <div className="mt-4">
        <DataTable<Bird, unknown> columns={columns} data={list || []} />
      </div>
    </div>
    </>
  );
}
