"use client";

import { useNavigation, useOne, useResource, useShow } from "@refinedev/core";
import { useEffect } from 'react';
import { LucideEdit, LucideList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from '@/components/breadcrumb-provider';
import {DetailField, BooleanField} from "@/components/ui/show-page-fields";

export default function BirdShow() {
  const { edit, list } = useNavigation();
  const { id } = useResource();
  const { queryResult } = useShow({});
  const { data } = queryResult;
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { route: '/dashboard', name: 'Accueil' },
      { route: '/bird', name: 'Oiseaux' },
    ]);
  }, [setBreadcrumbs]);

  const record = data?.data;

  const { data: speciesData, isLoading: speciesLoading } = useOne({
    resource: "species",
    id: record?.species, // Assuming record?.species contains the species ID
  });
  const speciesName = speciesLoading ? "Loading..." : speciesData?.data?.name || "Non spécifiée";

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{record?.name ?? ""}</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => { list("bird"); }}>
            <LucideList size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => { edit("bird", id ?? ""); }}>
            <LucideEdit size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <img
            src={record?.photo || ""}
            alt="Pas de photo"
            width={300}
            height={300}
            className="object-cover relative w-[300px] h-[300px] bg-muted/50 border rounded-lg flex items-center justify-center text-center"
          />
        <DetailField label="Identifiant" content={record?.name ?? ""} />
        <DetailField label="Nom" content={record?.given_name ?? ""} />
        <BooleanField label="Est publique" value={record?.is_public} />
        <DetailField label="Espèce" content={speciesName} />
      </div>
    </div>
  );
}
