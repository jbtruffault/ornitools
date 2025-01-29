'use client';

import { BaseRecord, useList } from "@refinedev/core";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import * as React from "react";

import { BirdEditForm } from "../../components/bird-edit-form";

export default function BirdEdit() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  

  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/bird', name: 'Oiseaux' },
    ]);
  }, [setBreadcrumbs]);

  const [, setSheetOpen] = useState(false);
  const [, setList] = useState<BaseRecord[]>([]);
  const { data: birdData, isLoading: listLoading, refetch } = useList({ resource: "bird" });

  useEffect(() => {
    if (birdData) {
      setList(birdData.data);
    }
  }, [birdData]);

  // Function to close the sheet and refetch the bird list
  const handleNewBirdSubmit = async () => {
    await refetch();
    setSheetOpen(false);
  };

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
    <div>
      <div className="container mx-auto py-10">
        <BirdEditForm onSubmitSuccess={handleNewBirdSubmit}/>
      </div>
    </div>
  );
}
