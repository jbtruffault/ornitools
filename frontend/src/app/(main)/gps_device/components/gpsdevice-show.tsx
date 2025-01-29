'use client';

import { useForm } from "react-hook-form";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { useOne } from "@refinedev/core"; // Used to fetch data
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

const FormSchema = z.object({
  name: z
    .string()
    .max(100, { message: "Le n° d'identification doit faire maximum 100 caractères." })
    .min(1, { message: "Le n° d'identification est obligatoire." }),
  manufacturer: z
    .string()
    .max(100, { message: "La marque doit faire maximum 100 caractères." })
    .min(1, { message: "La marque est obligatoire." }),
  model: z
    .string()
    .max(100, { message: "Le modèle doit faire maximum 100 caractères." })
    .min(1, { message: "Le modèle est obligatoire." }),
  serial_number: z.string().optional(),
});

interface GPSDeviceShowProps {
  gpsDeviceId: string;
}

export function GPSDeviceShow({ gpsDeviceId }: GPSDeviceShowProps) {
  const { data: gpsDevice, isLoading: gpsDeviceLoading } = useOne({
    resource: "gps_device",
    id: gpsDeviceId,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      model: "",
      serial_number: "",
    },
  });

  React.useEffect(() => {
    if (gpsDevice) {
      form.reset({
        name: gpsDevice.data.name,
        manufacturer: gpsDevice.data.manufacturer,
        model: gpsDevice.data.model,
        serial_number: gpsDevice.data.serial_number,
      });
    }
  }, [gpsDevice, form]);

  if (gpsDeviceLoading) {
    return <p>Loading...</p>; 
  }

  return (
    <div>
      <Form {...form}>
        <form className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° d&apos;identification</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
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
                  <Input {...field} readOnly />
                </FormControl>
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
                  <Input {...field} readOnly />
                </FormControl>
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
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
