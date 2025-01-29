'use client';

import { useList } from "@refinedev/core";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import { Plus } from 'lucide-react';
import * as React from "react";

import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { SpeciesCreateForm } from "./components/species-create-form";
import { Species, columns } from "../species/components/species-list-columns";

export default function SpeciesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { data: speciesList, isLoading: speciesListLoading, refetch } = useList<Species>({ resource: "species" });
  const [list, setList] = useState<Species[]>([]);

  // Update list when speciesList changes
  useEffect(() => {
    if (speciesList) {
      setList(speciesList.data);
    }
  }, [speciesList]);

  // Set breadcrumbs on load
  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/species', name: 'Espèces' },
    ]);
  }, [setBreadcrumbs]);

  // Function to close the sheet and refetch the species list
  const handleNewSpeciesSubmit = async () => {
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
  if (authLoading || speciesListLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 p-4">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Espèces
          </h1>
          <SheetTrigger>
            <Button variant="outline"><Plus size={16} /></Button>
          </SheetTrigger>
        </div>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Créer une nouvelle espèce</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          
          <SpeciesCreateForm onSubmitSuccess={handleNewSpeciesSubmit} />

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Data table */}
      <div className="mt-4">
        <DataTable<Species, unknown> columns={columns} data={list} />
      </div>
    </div>
  );
}
