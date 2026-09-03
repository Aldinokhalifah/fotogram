'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user';
import { UpdateUserInput } from '@/types/User';
import toast from 'react-hot-toast';

export const userQueryKeys = {
    all: ['users'] as const,
    byId: (userId: string) => ['users', userId] as const,
    byUsername: (keyword: string) => ['users', 'search', keyword] as const
};

export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: userQueryKeys.byId(userId ?? ''),
        queryFn: () => userService.getById(userId as string),
        enabled: Boolean(userId),
    });
}

export function useSearchUsers(keyword: string) {
    return useQuery({
        queryKey: userQueryKeys.byUsername(keyword),
        queryFn: () => userService.searchUsers(keyword),
        enabled: Boolean(keyword)
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateUserInput }) =>
            userService.updateUser(data, userId),
        onSuccess: (_response, { userId }) => {
            toast.success(_response.message);
            void queryClient.invalidateQueries({ queryKey: userQueryKeys.byId(userId) });
        },
        onError: (_error) => {
            toast.error(_error.message);
        }
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => userService.deleteUser(userId),
        onSuccess: (_response, userId) => {
            toast.success(_response.message);
            queryClient.removeQueries({ queryKey: userQueryKeys.byId(userId) });
        },
        onError: (_error) => {
            toast.error(_error.message);
        }
    });
}