import { useList, BaseRecord } from "@refinedev/core";
import { useEffect, useState } from 'react';
import { columns } from "./bird-picker-columns";
import { DataTable } from "./bird-picker-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Bird } from "@/app/(main)/bird/components/bird-list-columns";

interface BirdPickerProps {
  onBirdSelectionChange: (selectedBirds: BaseRecord[]) => void; // Explicitly typed prop
}

export function BirdPicker({ onBirdSelectionChange }: BirdPickerProps) {
  const { data: birdList, isLoading: birdListLoading, refetch } = useList({ resource: "bird" });
  const [birdListState, setBirdListState] = useState<Bird[]>([]);

  useEffect(() => {
    if (birdList) {
      const transformedBirdList = birdList.data.map((bird) => ({
        ...bird,
        id: bird.id ?? "default-id",
      })) as Bird[];
      setBirdListState(transformedBirdList);
    }
  }, [birdList]);

  const handleRowSelectionChange = () => {
    // Adapt callback to match expected signature
    onBirdSelectionChange([]); // Example
  };

  // Render loading screen if data or authentication is loading
  if (birdListLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex h-full w-full select-none flex-col justify-end rounded-md from-muted/50 to-muted no-underline outline-none focus:shadow-md">
        <DataTable
          columns={columns}
          data={birdListState}
          onRowSelectionChange={handleRowSelectionChange}
        />
      </div>
    </div>
  );
}
