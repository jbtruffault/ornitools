'use client';

import { Row } from "@tanstack/react-table";
import { CustomColumnDef } from "@/components/ui/datatable" 
import { useOne, useDelete } from "@refinedev/core";
import { Button } from "@/components/ui/button";
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
import { LucideTrash2, ArrowDownToLine } from "lucide-react";


export type GPSPositionFile = {
  id: string;
  file: string;
  gps_device: string;
  first_position_timestamp: string;
  last_position_timestamp: string;
  position_count: string;
};

export const GPSPositionFileColumns: CustomColumnDef<GPSPositionFile>[] = [
  {
    accessorKey: "file",
    header: "Fichier",
    headerClassName: "max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap",
    cellClassName: "max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap",
    cell: ({ row }) => {
      const filename = row.original.file.replace(/^.*[\\/]/, "");
      return <span>{filename}</span>;
    },
  },
  {
    accessorKey: "first_position_timestamp",
    header: "De",
    cell: ({ row }) => {
      const date = new Date(row.original.first_position_timestamp);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return (
        <span className="block md:inline">
          {formattedDate.split("/").slice(0, 2).join("/")} {/* Masque l'année sur petits écrans */}
        </span>
      );
    },
  },
  {
    accessorKey: "last_position_timestamp",
    header: "À",
    cell: ({ row }) => {
      const date = new Date(row.original.last_position_timestamp);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return (
        <span className="block md:inline">
          {formattedDate.split("/").slice(0, 2).join("/")} {/* Masque l'année sur petits écrans */}
        </span>
      );
    },
  },
  {
    accessorKey: "position_count",
    header: "Nb positions",
    cell: ({ row }) => <span>{row.original.position_count}</span>,
  },
  {
    accessorKey: "gps_device",
    header: "Balise",
    cell: ({ row }) => (
      <span className="hidden lg:table-cell">
        <GPSDeviceCell row={row} />
      </span>
    ),
    headerClassName: "hidden md:table-cell",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

const GPSDeviceCell = ({ row }: { row: Row<GPSPositionFile> }) => {
  const { data: gpsDeviceData, isLoading } = useOne({
    resource: "gps_device",
    id: row.original.gps_device,
  });

  if (isLoading) return <span>Chargement...</span>;

  return <span>{gpsDeviceData?.data?.name || "Inconnu"}</span>;
};

const ActionsCell = ({ row }: { row: Row<GPSPositionFile> }) => {
  const { mutate: deleteItem } = useDelete();

  const handleDownload = () => {
    const downloadUrl = `${row.original.file}`;

    // Déclenche le téléchargement dans le navigateur
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = row.original.file.replace(/^.*[\\/]/, "");
    anchor.target = "_blank"; // Optionnel : ouvre dans un nouvel onglet
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button
        variant="ghost_border"
        size="icon"
        onClick={handleDownload}
      >
        <ArrowDownToLine size={15} />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost_destructive" size="icon">
            <LucideTrash2 size={15} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Vous vous apprêtez à supprimer le fichier GPS :{" "}
              <strong>{row.original.file.replace(/^.*[\\/]/, "")}</strong>.
              Est-ce que vous confirmez ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteItem({
                  resource: "gps_file",
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
