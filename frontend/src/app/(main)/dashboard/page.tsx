'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';

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
      <h1>Dashboard</h1>
      <p>Welcome, {user?.first_name}!</p>
      <p>Your email: {user?.email}</p>
    </div>
  );
}
