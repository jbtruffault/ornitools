'use client';

import { useState, useEffect } from 'react';
import { useCreate } from "@refinedev/core";
import Dropzone from '@/components/ui/dropzone';
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useList } from '@refinedev/core';
import { cn } from "@/lib/utils";
import { toast } from "@/components/hooks/use-toast"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from "next/navigation";

export const UploadGPSFile = ({ onSubmitSuccess }: { onSubmitSuccess: () => void}) => {

  const { mutate, isLoading, isError, error } = useCreate();  
  const [filesUploaded, setFilesUploaded] = useState<File[]>([]);
  const { data: gpsDeviceList, isLoading: gpsDeviceLoading } = useList({ resource: "gps_device" });
  const [value, setValue] = useState("")
  const [gpsDeviceId, setGPSDeviceId] = useState("")
  const [open, setOpen] = useState(false)
  const params = useParams();
  const birdId = params?.id;

  // Watch for changes to the filesUploaded state
  useEffect(() => {
    if (filesUploaded.length === 0) {
      console.log("File list has been reset", filesUploaded);
    }
  }, [filesUploaded]);

  const handleFileUpload = () => {
    
    if (filesUploaded.length > 0) {
      const formData = new FormData();
      formData.append('file', filesUploaded[0]); 
      formData.append('gps_device', gpsDeviceId);
      formData.append('bird', String(birdId));
      console.log(filesUploaded)

      mutate(
        {
          resource: "gps_file/",
          values: formData,
        },
        {
          //retry: 3,
          onSuccess: () => {
            toast({
              variant: 'creative',
              title: "Enregistrement du fichier réussi",
              description: `${filesUploaded[0]?.name} enregistré`,
            });
            
            // reset file list
            setFilesUploaded([]);
            console.log("after reset", filesUploaded)


            onSubmitSuccess();
          },
          onError: (error) => {
            const errorMessage = error.response?.data
              ? <pre>{JSON.stringify(error.response?.data, null, 2)}</pre>
              : String(error) || "Il y a eu un problème"; 
            toast({
              variant: 'destructive',
              title: 'Erreur:',
              description: errorMessage, 
            });
          },
        }
      );
    }
  };

  return (
    <div>
      <div className='mt-4'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[300px] justify-between"
              )}
            >
              {value
                ? gpsDeviceList?.data?.find((gpsDevice) => gpsDevice.name === value)?.name : "Sélectionner la balise GPS"
                }
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Recherche..." />
              <CommandList>
                <CommandEmpty>Pas de balise correspondante</CommandEmpty>
                <CommandGroup>
                  {gpsDeviceLoading ? (
                    <div>Chargement...</div>
                  ) : (
                    gpsDeviceList?.data?.map((gpsDevice) => (
                      <CommandItem
                        value={gpsDevice.name}
                        key={gpsDevice.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          const selectedDevice = gpsDeviceList?.data?.find(
                            (device) => device.name === currentValue
                          );
                          setGPSDeviceId(selectedDevice?.id as string);
                          setOpen(false);
                        }}
                      >
                        {gpsDevice.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === gpsDevice.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className='mt-4'>
        <Dropzone 
        onDrop={(acceptedFiles) => setFilesUploaded([...filesUploaded, ...acceptedFiles])}
        filesUploaded={filesUploaded}
        setFilesUploaded={setFilesUploaded} 
        />      
        <Button 
          className="mt-4" 
          onClick={handleFileUpload} 
          disabled={isLoading} // Désactive le bouton pendant le téléchargement
        >
          {isLoading ? 'Envoi...' : 'Enregistrer le fichier'}
        </Button>
      </div>
      {isError && (
        <div className="text-red-600">
          Erreur lors de l&apos;envoi du fichier : {error?.message || "Unknown error"}
        </div>
      )}
    </div>
  );
};

export default UploadGPSFile;
