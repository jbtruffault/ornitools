'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';

import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./components/user-edit-form"

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Utilisation d'un état pour vérifier si le code est exécuté côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // S'assurer que le rendu ne se fait qu'une fois que le composant est monté côté client
  if (!isClient || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="container mx-auto py-10 p-4">
      <div className="space-y-6 flex-1 md:max-w-2xl">
        <div>
          <h3 className="text-lg font-medium">Profil</h3>
          <p className="text-sm text-muted-foreground">
            Vos informations personnelles. 
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </div>
  );
}
