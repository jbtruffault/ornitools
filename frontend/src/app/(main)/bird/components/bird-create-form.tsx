'use client';

import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreate, useList } from "@refinedev/core";
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
import { ColorPicker } from "@/components/ui/color-picker"
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const FormSchema = z.object({
  name: z.string()
    .max(100, { message: "L'identifiant doit faire maximum 100 caractères." })
    .min(1, { message: "L'identifiant est obligatoire." }),

  given_name: z.string()
    .max(100, { message: "Le nom doit faire maximum 100 caractères." })
    .optional(),

  species: z.number({
    required_error: "L'espèce est obligatoire.",
    invalid_type_error: "L'espèce doit être un identifiant numérique.",
  }),

  is_public: z.boolean(),

  description: z
    .string()
    .max(500, { message: "La description doit faire maximum 500 caractères." })
    .optional(),
  photo: z.any().optional(),

  color: z.string()
    .max(7, { message: "La couleur doit être un code hexadécimal à 7 caractères, exemple: #000080" })
    .optional(),
});

export function BirdCreateForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const { mutate } = useCreate();
  const { data: speciesList, isLoading: speciesLoading } = useList({
    resource: "species"
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [color, setColor] = useState('#000080')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { is_public: false },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("given_name", data.given_name || "");
    formData.append("species", data.species.toString());
    formData.append("is_public", data.is_public.toString());
    formData.append("color", data.color || "#000080");
    if (data.photo) {
      formData.append("photo", data.photo);
    }
    if (data.description) {
      formData.append("description", data.description);
    }

    mutate(
      {
        resource: "bird/",
        values: formData,
      },
      {
        onSuccess: () => {
          toast({
            variant: 'creative',
            title: "Enregistrement réussi",
            description: `${data.name} créé avec succès.`,
          });
          onSubmitSuccess();
          router.push('/bird');
        },
        onError: (error) => {
          const errorMessage = error.response?.data
            ? JSON.stringify(error.response.data, null, 2)
            : "Une erreur est survenue.";
          toast({
            variant: 'destructive',
            title: 'Erreur:',
            description: errorMessage,
          });
        },
      }
    );
  };

  useEffect(() => {
    if (color) {
      form.setValue("color", color);
    }
  }, [color]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Identifiant */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifiant de l&apos;individu</FormLabel>
              <FormControl>
                <Input {...field} className="w-[300px]" />
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
                <Input {...field} className="w-[300px]" />
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
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[300px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? speciesList?.data?.find((species) => species.id === field.value)?.name
                      : "Sélectionner l'espèce"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Recherche..." />
                    <CommandList>
                      <CommandEmpty>Pas d&apos;espèce correspondante</CommandEmpty>
                      <CommandGroup>
                        {speciesLoading ? (
                          <div>Chargement...</div>
                        ) : (
                          speciesList?.data?.map((species) => (
                            <CommandItem
                              key={species.id}
                              onSelect={() => {
                                if (species.id !== undefined) {
                                  form.setValue("species", species.id as number);
                                  setOpen(false);
                                } else {
                                  console.error("ID de l'espèce non défini");
                                }
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
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Public */}
        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Est public</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
                <Input {...field} className="w-[300px]" />
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
                  placeholder="Picture"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton d'enregistrement */}
        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  );
}
