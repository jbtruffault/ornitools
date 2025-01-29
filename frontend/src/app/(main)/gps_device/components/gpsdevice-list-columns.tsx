'use client';

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { CustomColumnDef } from "@/components/ui/datatable" 
import { useDelete } from "@refinedev/core";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideEdit, LucideEye, LucideTrash2 } from "lucide-react";
import { GPSDeviceEditForm } from "./gpsdevice-edit-form"
import { GPSDeviceShow } from "./gpsdevice-show";

export type GPSDevice = {
  id: string; // Ensure `id` is present in the data
  name: string;
  manufacturer: string;
  model: string;
  serial_number: string;
};

export const columns: CustomColumnDef<GPSDevice, unknown>[] = [
  {
    accessorKey: "name",
    header: "ID Balise",
  },
  {
    accessorKey: "manufacturer",
    header: "Fabriquant",
  },
  {
    accessorKey: "model",
    header: "Modèle",
  },
  {
    accessorKey: "serial_number",
    header: "Numéro de série",
  },
  {
    id: "actions",
    header: "Actions",
    cell: function ActionsCell({ row }) {
      const { mutate: deleteItem } = useDelete();
      const [editsheetOpen, setEditSheetOpen] = useState(false);
      const [showSheetOpen, setShowSheetOpen] = useState(false);

      const handleGPSDeviceSubmit = () => {
        setEditSheetOpen(false);
      };

      return (
        <div className="flex flex-row flex-wrap gap-2">

          {/* Show the device */}
          <Sheet open={showSheetOpen} onOpenChange={setShowSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost_border" size="icon">
                <LucideEye size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{row.original.name}</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <GPSDeviceShow gpsDeviceId={row.original.id} />
              <SheetFooter>
                <SheetTrigger asChild>
                  <Button variant="ghost">Fermer</Button>
                </SheetTrigger>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Edit the device */}
          <Sheet open={editsheetOpen} onOpenChange={setEditSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost_border" size="icon">
                <LucideEdit size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Modifier: {row.original.name}</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <GPSDeviceEditForm gpsDeviceId={row.original.id} onSubmitSuccess={handleGPSDeviceSubmit} />
              <SheetFooter>
                <SheetTrigger asChild>
                  <Button variant="ghost">Fermer</Button>
                </SheetTrigger>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Delete the device */}
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
                  Vous vous apprêtez à supprimer la balise GPS :{" "}
                  <strong>{row.original.name}</strong>. Est-ce que vous confirmez ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteItem({
                      resource: "gps_device",
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
    },
  },
];