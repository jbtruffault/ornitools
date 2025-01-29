"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from '@/components/auth-provider';
import * as React from "react"
import { useUpdate } from "@refinedev/core";
import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { change_password } from "@/tanstack/features/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const userFormSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "Le prénom est obligatoire." })
      .max(30, { message: "Le prénom ne doit pas dépasser 30 caractères." }),
    last_name: z
      .string()
      .min(1, { message: "Le nom est obligatoire." })
      .max(30, { message: "Le nom ne doit pas dépasser 30 caractères." }),
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." }),
    current_password: z.string().optional(), // Champ optionnel pour le mot de passe actuel
    new_password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
      .optional(), // Applique la validation, mais rend le champ optionnel
  })
  .refine(
    (data) => !data.new_password || data.current_password, // Vérifie que current_password est fourni si new_password est présent
    {
      message: "Veuillez fournir le mot de passe actuel pour changer le mot de passe.",
      path: ["current_password"], // L'erreur est placée sur current_password si la condition échoue
    }
  );

type UserFormValues = z.infer<typeof userFormSchema>;

export function ProfileForm() {
    const { user, isLoading } = useAuth();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
        },
        mode: "onChange",
    });

    const { mutate } = useUpdate();
    const onSubmit = (data: z.infer<typeof userFormSchema>) => {
        const profileData = new FormData();
        profileData.append("first_name", data.first_name);
        profileData.append("last_name", data.last_name);
        profileData.append("email", data.email);
    
        // Mise à jour des informations utilisateur
        mutate(
            {
                resource: "users",
                id: user?.id,
                values: profileData,
            },
            {
                onSuccess: async () => {
                    
                    // Modification du mot de passe si les champs sont remplis
                    if (data.current_password && data.new_password) {
                        const passwordData = {
                            current_password: data.current_password,
                            new_password: data.new_password,
                        };
    
                        const result = await change_password(passwordData);
    
                        if (result.success) {
                            toast({
                                variant: "creative",
                                title: "Mot de passe modifié",
                                description: "Votre mot de passe a été mis à jour avec succès.",
                            });
                        
                            // Réinitialise les champs de mot de passe
                            form.setValue("current_password", "");
                            form.setValue("new_password", "");
                        } else {
                            const errorMessage =
                                result.error?.response?.data
                                    ? JSON.stringify(result.error.response.data, null, 2)
                                    : result.error?.message || "Erreur inconnue";
                            toast({
                                variant: "destructive",
                                title: "Erreur modification mot de passe",
                                description: errorMessage,
                            });
                        }
                    } else {
                        toast({
                            variant: "creative",
                            title: "Enregistrement réussi",
                            description: `Profil mis à jour`,
                        });
                    }
                },
                onError: (error) => {
                    const errorMessage =
                        error.response?.data
                            ? JSON.stringify(error.response?.data, null, 2)
                            : String(error) || "Erreur inconnue";
                    toast({
                        variant: "destructive",
                        title: "Erreur mise à jour profil",
                        description: errorMessage,
                    });
                },
            }
        );
    };
    
    React.useEffect(() => {
        console.log('User:', user);
    }, [user]);

    if (isLoading) {return <div>Loading...</div>}
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse mail</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Enregistrer</Button>
            </form>
        </Form>
      )
}