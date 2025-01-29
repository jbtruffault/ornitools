import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { CustomColumnDef } from "@/components/ui/datatable" 
import { useDelete, useNavigation } from "@refinedev/core";
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
import { SpeciesEditForm } from "./species-edit-form";
import { LucideEdit, LucideEye, LucideTrash2 } from "lucide-react";

export type Species = {
  id: string;
  name: string;
  scientific_name: string;
  conservation_status: "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "EX" | "DD" | "NE";
};


export const columns: CustomColumnDef<Species, unknown>[] = [
  {
    accessorKey: "name",
    header: "Nom de l'espèce",
  },
  {
    accessorKey: "scientific_name",
    header: "Nom scientifique",
  },
  {
    accessorKey: "conservation_status",
    header: "Statut de conservation",
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

const ActionsCell = ({ row }: { row: Row<Species> }) => {
  const { show } = useNavigation();
  const { mutate: deleteItem } = useDelete();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSpeciesSubmit = () => {
    setSheetOpen(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Button
        variant="ghost_border"
        size="icon"
        onClick={() => show("species", row.original.id)}
      >
        <LucideEye size={20} />
      </Button>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost_border" size="icon">
            <LucideEdit size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier : {row.original.name}</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <SpeciesEditForm speciesId={row.original.id} onSubmitSuccess={handleSpeciesSubmit} />
          <SheetFooter>
            <SheetTrigger asChild>
              <Button variant="ghost">Fermer</Button>
            </SheetTrigger>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost_destructive" size="icon">
            <LucideTrash2 size={20} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;espèce <strong>{row.original.name}</strong> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteItem({
                  resource: "species",
                  id: `${row.original.id}/`,
                })
              }
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
