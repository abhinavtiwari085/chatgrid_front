import { useMutation, useQueryClient } from '@tanstack/react-query';

import { joinWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useJoinWorkspaceRequest = (workspaceId) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const { mutateAsync: joinWorkspaceMutation, isSuccess, isPending, error} = useMutation({
        mutationFn: (joinCode) => joinWorkspaceRequest({ workspaceId, joinCode, token: auth?.token }),
        onSuccess: () => {
            console.log('Workspace joined successfully');
            queryClient.invalidateQueries([`fetchWorkspaceById-${workspaceId}`]);
            queryClient.invalidateQueries(['list-dms', workspaceId]);
        },
        onError: (error) => {
            console.log('Error in joining workspace', error);
        }
    });

    return {
        joinWorkspaceMutation,
        isSuccess,
        isPending,
        error
    };
};
