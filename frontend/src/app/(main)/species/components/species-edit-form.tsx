'use client';

import { useForm } from "react-hook-form";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdate, useOne } from "@refinedev/core";
import { toast } from "@/components/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";

const conservation_status = [
  { value: "LC", label: "Préoccupation mineure (LC)" },
  { value: "NT", label: "Espèce quasi menacée (NT)" },
  { value: "VU", label: "Espèce vulnérable (VU)" },
  { value: "EN", label: "Espèce en danger (EN)" },
  { value: "CR", label: "En danger critique d'extinction  (CR)" },
  { value: "EW", label: "Éteint à l'état sauvage (EW)" },
  { value: "EX", label: "Éteint (EX)" },
  { value: "DD", label: "Données insuffisantes (DD)" },
  { value: "NE", label: "Non-Évalué (NE)" },
];

const FormSchema = z.object({
  name: z.string()
    .max(100, { message: "Le nom doit faire maximum 100 caractères." })
    .min(1, { message: "Le nom est obligatoire." }),
  scientific_name: z.string()
    .max(100, { message: "Le nom scientifique doit faire maximum 100 caractères." })
    .min(1, { message: "Le nom scientifique est obligatoire." }),
  conservation_status: z.string()
    .max(100, { message: "Le statut de conservation doit faire maximum 100 caractères." })
    .min(1, { message: "Le statut de conservation est obligatoire." }),
  description: z.string().optional(),
});

interface SpeciesEditFormProps {
  speciesId: string;
  onSubmitSuccess: () => void;
}

export function SpeciesEditForm({ speciesId, onSubmitSuccess }: SpeciesEditFormProps) {
  const { data, isLoading } = useOne({
    resource: "species",
    id: speciesId,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.data?.name || "",
      scientific_name: data?.data?.scientific_name || "",
      conservation_status: data?.data?.conservation_status || "",
      description: data?.data?.description || "",
    },
  });

  React.useEffect(() => {
    if (data) {
      form.reset({
        name: data.data.name,
        scientific_name: data.data.scientific_name,
        conservation_status: data.data.conservation_status,
        description: data.data.description,
      });
    }
  }, [data, form]);

  const { mutate } = useUpdate();

  // Form submission handler
  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        resource: "species",
        id: speciesId,
        values: data,
      },
      {
        onSuccess: () => {
          toast({
            variant: 'creative',
            title: "Mise à jour réussie",
            description: `${data?.name ?? ""} mis à jour`,
          });

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          {/* Nom */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;espèce</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom scientifique */}
          <FormField
            control={form.control}
            name="scientific_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom scientifique</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Statut de conservation */}
          <FormField
            control={form.control}
            name="conservation_status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Statut de conservation</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? conservation_status.find(
                              (statut) => statut.value === field.value
                            )?.label
                          : "Sélectionner"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Recherche..." />
                      <CommandList>
                        <CommandEmpty>Pas de statut correspondant</CommandEmpty>
                        <CommandGroup>
                          {conservation_status.map((statut) => (
                            <CommandItem
                              value={statut.label}
                              key={statut.value}
                              onSelect={() => {
                                form.setValue("conservation_status", statut.value);
                              }}
                            >
                              {statut.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  statut.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Mettre à jour</Button>
        </form>
      </Form>
    </div>
  );
}
