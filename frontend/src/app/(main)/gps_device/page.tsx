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

import { GPSDevice, columns } from "./components/gpsdevice-list-columns";
import { GPSDeviceCreateForm } from "./components/gpsdevice-create-form";

export default function GPSDevicePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
  setBreadcrumbs([
  { route: '/dashboard', name: 'Accueil' },
  { route: '/gps_device', name: 'Balises GPS' },
  ]);
  }, [setBreadcrumbs]);
  
  const [sheetOpen, setSheetOpen] = useState(false);
  const [list, setList] = useState<GPSDevice[]>([]);
  const { data: gps_device_data, isLoading: listLoading, refetch } = useList<GPSDevice>({ resource: "gps_device" });
  
  useEffect(() => {
  if (gps_device_data) {
  setList(gps_device_data.data);
  }
  }, [gps_device_data]);
  
  // Function to close the sheet and refetch the gps_device list
  const handleNewGPSDeviceSubmit = async () => {
  console.log("handle new GPS device")
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
  if (authLoading || listLoading) {
  return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-10 p-4">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="flex items-center justify-between border-b pb-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Balises GPS
        </h1>
        <SheetTrigger>
        <Button variant="outline"><Plus size={16} /></Button>
        </SheetTrigger>
        </div>
        
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Créer un nouvel individu</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <GPSDeviceCreateForm onSubmitSuccess={handleNewGPSDeviceSubmit} />

          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Data table */}
      <div className="mt-4">
        <DataTable<GPSDevice, unknown> columns={columns} data={list} />
      </div>
    </div>
  );
  }