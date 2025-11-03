import { useQuery } from '@tanstack/react-query';

import { fetchWorkspaceDetailsRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetWorkspaceById = (id, options = {}) => {
    const { auth } = useAuth();
    const { enabled = true } = options;
    const { isFetching, isSuccess, error, data: workspace } = useQuery({
        queryFn: () => fetchWorkspaceDetailsRequest({ workspaceId: id, token: auth?.token }),
        queryKey: [`fetchWorkspaceById-${id}`],
        staleTime: 10000,
        enabled
    });

    return {
        isFetching,
        isSuccess,
        error,
        workspace
    };
};
