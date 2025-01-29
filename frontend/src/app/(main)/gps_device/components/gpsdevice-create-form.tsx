'use client';

import { useForm } from "react-hook-form"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreate } from "@refinedev/core";
import { toast } from "@/components/hooks/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


const FormSchema = z.object({
  name: z.string()
  .max(100, {message: "Le n° d'identification' doit faire maximum 100 caractères.",})
  .min(1, {message: "Le n° d'identification est obligatoire.",}),
  
  manufacturer: z.string()
  .max(100, {message: "La marque doit faire maximum 100 caractères.",})
  .min(1, {message: "La marque est obligatoire.",}),
  
  model: z.string()
  .max(100, {message: "Le modèle doit faire maximum 100 caractères.",})
  .min(1, {message: "Le modèle est obligatoire.",}),
  
  serial_number: z.string().optional(),
})

export function GPSDeviceCreateForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  const { mutate } = useCreate();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        resource: "gps_device/",
        values: {
          name: data.name,
          manufacturer: data.manufacturer,
          model: data.model,
          serial_number: data.serial_number,
        },
      },
      {
        //retry: 3,
        onSuccess: () => {
          toast({
            variant: 'creative',
            title: "Enregistrement réussi",
            description: `${data?.name ?? ""} créé`,
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
            variant: 'destructive',
            title: 'Erreur:',
            description: errorMessage, 
          });
        },
      }
    );
  }

return (
    <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° d&apos;identification</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de série</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </div>
    )
}

