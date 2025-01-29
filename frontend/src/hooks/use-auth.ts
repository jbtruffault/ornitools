import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authProvider } from "@/components/auth-provider";
import { register } from "@/tanstack/features/client";

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
      if (!authProvider.getIdentity) {
        throw new Error("authProvider.getIdentity is not defined");
      }
      return authProvider.getIdentity();
    },
    retry: false,
  });
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authProvider.login(data),
    onSuccess: () => {
      queryClient.clear();
      router.push('/dashboard');
    },
  });

};
  
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params) => authProvider.logout(params),
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
      //re_password: string;
    }) => register(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
      toast.success('Compte correctement créé');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de compte');
    },
  });
}
