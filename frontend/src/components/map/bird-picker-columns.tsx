import { CustomColumnDef } from "@/components/ui/datatable" 
import { Checkbox } from "@/components/ui/checkbox";
import { Bird } from "@/app/(main)/bird/components/bird-list-columns";

export const columns: CustomColumnDef<Bird>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="items-top flex space-x-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name', // Ajoutez un accessorKey ou accessorFn ici
      header: 'Tout sélectionner',
    },
  ];