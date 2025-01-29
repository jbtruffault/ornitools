"use client";

import { useNavigation, useResource, useShow } from "@refinedev/core";
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  LucideEdit,
  LucideList,
} from "lucide-react";
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import { DetailField } from "@/components/ui/show-page-fields";

export default function SpeciesShow() {
  const { edit, list } = useNavigation();
  const { id } = useResource();
  const { queryResult } = useShow({});
  const { data } = queryResult;
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/species', name: 'Espèces' },
    ]);
  }, [setBreadcrumbs]);

  const record = data?.data;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{record?.name ?? ""}</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => { list("species"); }}>
            <LucideList size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => { edit("species", id ?? ""); }}>
            <LucideEdit size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <DetailField label="Nom de l'espèce" content={record?.name ?? ""} />
        <DetailField label="Nom scientifique" content={record?.scientific_name ?? ""} />
        <DetailField label="Statut de conservation" content={record?.conservation_status ?? ""} />
        <DetailField label="Description" content={record?.description ?? ""} />
      </div>
    </div>
  );
}
