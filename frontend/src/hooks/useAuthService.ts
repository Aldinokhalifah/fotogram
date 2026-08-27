'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { RegisterUserInput } from '@/types/User';
import toast from 'react-hot-toast';

export const authQueryKeys = {
    currentUser: ['auth', 'current-user'] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: authQueryKeys.currentUser,
        queryFn: () => authService.getMe(),
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterUserInput) => authService.register(data),
        onSuccess: (_response) => {
            toast.success(_response.message);
        }, 
        onError: (_error) => {
            toast.error(_error.message)
        }
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            authService.login({ email, password }),
        onSuccess: (_response) => {
            toast.success(_response.message);
        }, 
        onError: (_error) => {
            toast.error(_error.message)
        }
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: (_response) => {
            toast.success(_response.message);
            void queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });
        }, 
        onError: (_error) => {
            toast.error(_error.message)
        }
    });
}