'use client';

import { Row } from "@tanstack/react-table";
import { CustomColumnDef } from "@/components/ui/datatable" 
import { useNavigation, useOne, useUpdate, useDelete, BaseRecord } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, LucideEdit, LucideEye, LucideTrash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Bird extends BaseRecord {
  id: string;
  name: string;
  given_name: string;
  is_public: boolean;
  species: string;
  photo: string;
  description: string;
  color: string;
};

export const columns: CustomColumnDef<Bird>[] = [
  {
    accessorKey: "name",
    header: "Identifiant",
  },
  {
    accessorKey: "given_name",
    header: "Nom",
  },
  {
    accessorKey: "is_public",
    header: "Publique",
    cell: function IsPublicCell({ row }) {
      const { mutate } = useUpdate();

      const handleToggle = () => {
        mutate(
          {
            resource: "bird",
            id: row.original.id,
            values: {
              is_public: !row.original.is_public,
              species: row.original.species,
              name: row.original.name,
            },
          },
          {
            onSuccess: () => {
              console.log(`Bird ${row.original.id} updated successfully`);
            },
            onError: (error) => {
              console.error("Error updating bird:", error);
            },
          }
        );
      };

      return (
        <Button variant="ghost_border" onClick={handleToggle}>
          {row.original.is_public ? (
            <CircleCheck className="text-green-500" size={30} />
          ) : (
            <CircleX className="text-red-500" size={30} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "species",
    header: "Espèce",
    cell: function SpeciesNameCell({ row }) {
      const { data: speciesData, isLoading } = useOne({
        resource: "species",
        id: row.original.species,
      });

      if (isLoading) {
        return <span>Loading...</span>;
      }

      return <span>{speciesData?.data?.name || "Inconnu"}</span>;
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Actions",
    cell: function render({ row }) {
      return <ActionsCell row={row} />;
    },
  },
];

const ActionsCell = ({ row }: { row: Row<Bird> }) => {
  const { show, edit } = useNavigation();
  const { mutate: deleteItem } = useDelete();

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button
        variant="ghost_border"
        size="icon"
        onClick={() => {
          show("bird", row.original.id);
        }}
      >
        <LucideEye size={20} />
      </Button>
      <Button
        variant="ghost_border"
        size="icon"
        onClick={() => {
          edit("bird", row.original.id);
        }}
      >
        <LucideEdit size={20} />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost_destructive" size="icon">
            <LucideTrash2 size={20} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Vous vous apprêtez à supprimer l&apos;oiseau : <strong>{row.original.name}</strong>. Est-ce que vous confirmez ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteItem({
                  resource: "bird",
                  id: `${row.original.id}/`,
                });
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
