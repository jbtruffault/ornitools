import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowSelectionChange: () => void;
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [previousSelection, setPreviousSelection] = React.useState<TData[]>([]);
  const [isTableInitialized, setIsTableInitialized] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Surveiller les changements dans rowSelection
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    if (JSON.stringify(selectedRows) !== JSON.stringify(previousSelection)) {
      localStorage.setItem('selectedBirds', JSON.stringify(selectedRows));
      setPreviousSelection(selectedRows);
      onRowSelectionChange();
    }
  }, [rowSelection, onRowSelectionChange, previousSelection, table]);

  // Vérifier si la table est initialisée
  React.useEffect(() => {
    if (table.getRowModel().rows.length > 0) {
      setIsTableInitialized(true);
    }
  }, [data, table]);

  // Récupérer les sélections du localStorage lors du chargement du composant
  React.useEffect(() => {
    
    if (isTableInitialized) {
      const storedSelection = localStorage.getItem('selectedBirds');
      if (storedSelection) {
        const selectedRows = JSON.parse(storedSelection);
        if (Array.isArray(selectedRows)) {
          const newRowSelection: Record<string, boolean> = {};
          selectedRows.forEach((bird: TData) => {
            table.getRowModel().rows.forEach((row) => {
              if (row.original.id === bird.id) {
                newRowSelection[row.id] = true;
              }
            });
          });
          setRowSelection(newRowSelection);
          setPreviousSelection(selectedRows);
        }
      }
    }
  }, [isTableInitialized, table]);

  return (
    <div>
      <div className="flex items-center pb-1">
        <Input
          placeholder="Filtrage des oiseaux ..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <ScrollArea className="h-[350px] rounded-md pt-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} noBorder={true}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={rowSelection[row.id] ? "selected" : undefined}
                  onClick={() => {
                    // Basculer la sélection de la ligne
                    const isSelected = rowSelection[row.id];
                    setRowSelection({
                      ...rowSelection,
                      [row.id]: !isSelected,
                    });
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow noBorder={true}>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
