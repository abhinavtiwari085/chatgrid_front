import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { createOrGetDM } from '@/apis/dms';
import { useAuth } from '@/hooks/context/useAuth';

export const useOpenDM = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const { mutateAsync: openDM, isPending, error } = useMutation({
    mutationFn: async (memberId) => {
      if (memberId === auth?.user?._id) {
        throw new Error('Cannot open a DM with yourself');
      }
      const channel = await createOrGetDM({
        token: auth?.token,
        workspaceId,
        memberId
      });
      return channel;
    },
    onSuccess: (channel) => {
      if (channel?._id) {
        navigate(`/workspaces/${workspaceId}/channels/${channel._id}`);
      }
    }
  });

  return { openDM, isPending, error };
};
