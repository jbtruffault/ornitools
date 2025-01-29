'use client';

import * as React from "react";
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigation, useUpdate, useOne, useList, BaseRecord } from "@refinedev/core";
import { LucideList } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadGPSFile } from './bird-upload-gps-file';
import { DataTable } from "@/components/ui/datatable";
import { GPSPositionFileColumns, GPSPositionFile } from './bird-gpsfile-list-columns'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/hooks/use-toast";
import { FormSchema } from "./bird-create-form";
import Image from "next/image";

export function BirdEditForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const { list } = useNavigation();
  const params = useParams();
  const birdId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: birdData, isLoading: birdLoading } = useOne({
    resource: 'bird',
    id: birdId,
  });

  const { data: speciesData, isLoading: speciesLoading } = useOne({
    resource: "species",
    id: birdData?.data?.species as number,
  });
  const { data: speciesList, isLoading: speciesListLoading } = useList({ resource: "species" });
  const { data: gpsFileList, isLoading: gpsFileListLoading, refetch: gpsFileListRefetch } = useList<BaseRecord>({
    resource: "gps_file",
    filters: [
      {
        field: "bird_id",
        operator: "eq",
        value: birdId,
      },
    ],
  });
  const [gpsFileList_state, setGPSFileList_state] = useState<GPSPositionFile[]>([]);
  const [open, setOpen] = useState(false)

  const [color, setColor] = useState('#000080')

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        name: birdData?.data?.name || "",
        given_name: birdData?.data?.given_name || "",
        species: birdData?.data?.species || speciesList?.data?.[0]?.id || 1,
        is_public: birdData?.data?.is_public || false,
        photo: null,
        description: birdData?.data?.description || "",
        color: birdData?.data?.color || "#000080",
    },
});

  useEffect(() => {
    if (gpsFileList?.data) {
      setGPSFileList_state(
        gpsFileList.data.map((item) => ({
          id: String(item.id),
          file: item.file,
          gps_device: item.gps_device,
          first_position_timestamp: item.first_position_timestamp,
          last_position_timestamp: item.last_position_timestamp,
          position_count: item.position_count,
        }))
      );
    }
  }, [gpsFileList]);

  useEffect(() => {
    if (birdData?.data) {
      form.setValue("name", birdData.data.name);
      form.setValue("given_name", birdData.data.given_name || "");
      form.setValue("is_public", birdData.data.is_public);
      form.setValue("species", birdData.data.species || speciesList?.data?.[0]?.id || 1);
      form.setValue("photo", null);
      form.setValue("description", birdData.data.description || "");
      form.setValue("color", birdData.data.color || "#000080");

      setColor(birdData.data.color || "#000080")
    }
  }, [birdData, form, speciesList]);

  useEffect(() => {
    if (color) {
      form.setValue("color", color);
      console.log(color)
    }
  }, [color]);

  const { mutate } = useUpdate();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("given_name", data.given_name || "");
    formData.append("species", data.species.toString());
    formData.append("is_public", data.is_public.toString());
    formData.append("photo", data.photo || "");
    formData.append("description", data.description || "");
    formData.append("color", data.color || "#000080");

    mutate(
      {
        resource: "bird",
        id: birdId,
        values: formData,
      },
      {
        onSuccess: () => {
          toast({
            variant: "creative",
            title: "Enregistrement réussi",
            description: `${birdData?.data?.name ?? ""} mis à jour`,
          });
          onSubmitSuccess();
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data ? (
              <pre>{JSON.stringify(error.response?.data, null, 2)}</pre>
            ) : (
              String(error) || "Il y a eu un problème"
            );
          toast({
            variant: "destructive",
            title: "Erreur:",
            description: errorMessage,
          });
        },
      }
    );
  };

  const handleNewGPSFileSubmit = async () => {
    await gpsFileListRefetch();
  };

  if (birdLoading || speciesLoading || speciesListLoading || gpsFileListLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Modifier {birdData?.data?.name ?? ""}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => { list("bird"); }}>
            <LucideList size={16} />
          </Button>
        </div>
      </div>
      <div className="mt-4">
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 w-full">
            <div className="space-y-6">
              {/* Public */}
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est publique</FormLabel>
                    <FormControl>
                      <Switch className="m-2" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identifiant */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant de l&apos;individu</FormLabel>
                    <FormControl>
                      <Input className="w-[300px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nom */}
              <FormField
                control={form.control}
                name="given_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input className="w-[300px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Espèce */}
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Espèce</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            value={field.value}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[300px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? speciesData?.data?.name || "Sélectionner l'espèce"
                              : "Sélectionner l'espèce"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Recherche..." />
                          <CommandList>
                            <CommandEmpty>Pas d&apos;espèce correspondante</CommandEmpty>
                            <CommandGroup>
                              {/* Assuming speciesList is available */}
                              {speciesList?.data?.map((species) => (
                                <CommandItem
                                value={species.name}
                                key={species.id}
                                onSelect={() => {
                                  form.setValue("species", species.id as number);
                                  setOpen(false);
                                }}
                              >
                                {species.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    species.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="w-[300px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur trace GPS</FormLabel>
                    <br/>
                    <FormControl>
                      <ColorPicker
                        className="w-[300px]"
                        background={color}
                        setBackground={setColor}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="space-y-6">
              <img
                src={birdData?.data?.photo || ""}
                alt="Pas de photo"
                width={300}
                height={300}
                className="object-cover relative w-[300px] h-[300px] bg-muted/50 border rounded-lg flex items-center justify-center text-center"
              />

              {/* Photo */}
              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        className="w-[300px]"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-10 flex items-center justify-between border-b pb-2">
        <h2 className="font-heading font-semibold tracking-tight">Fichiers GPS</h2>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="w-full md:col-span-1">
          <CardHeader>
            <CardTitle>Nouveau fichier</CardTitle>
            <CardDescription>
              Déposer ici un nouveau fichier GPS rattaché à {birdData?.data?.name ?? ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadGPSFile onSubmitSuccess={handleNewGPSFileSubmit}/>
          </CardContent>
        </Card>

        <Card className="w-full md:col-span-2 overflow-x-auto">
          <CardHeader>
            <CardTitle>Fichiers</CardTitle>
            <CardDescription >
              Liste des fichiers GPS rattachés à {birdData?.data?.name ?? ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={GPSPositionFileColumns} data={gpsFileList_state} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
