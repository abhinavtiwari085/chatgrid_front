import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { actOnDMInvite, listAllDMInvites } from '@/apis/dms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/context/useAuth';

export const Notifications = () => {
  const { workspaceId } = useParams();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const { data: invites, isFetching } = useQuery({
    queryKey: ['dm-invites', 'all'],
    queryFn: () => listAllDMInvites({ token: auth?.token })
  });

  const { mutateAsync: actOnInvite } = useMutation({
    mutationFn: ({ inviteId, action }) => actOnDMInvite({ token: auth?.token, inviteId, action }),
    onSuccess: () => {
      queryClient.invalidateQueries(['dm-invites', 'all']);
      queryClient.invalidateQueries(['list-dms', workspaceId]);
    }
  });

  if (isFetching) return <div className='p-4 text-sm text-white/60'>Loading notifications...</div>;

  return (
    <div className='flex h-full flex-col text-[#f9edffcc]'>
      <div className='px-3 pt-3'>
        <div className='text-lg font-bold text-white mb-2'>Notifications</div>
      </div>
      <Separator className='my-3 bg-white/10' />
      <div className='px-1 pb-4 overflow-y-auto'>
        {(invites || []).map((inv) => (
          <div
            key={inv._id}
            className='flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-white/10'
          >
            <div className='flex items-center gap-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage src={inv.senderId?.avatar} />
                <AvatarFallback className='text-[11px]'>
                  {(inv.senderId?.username || '?').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='text-sm'>
                Invite from <span className='font-medium'>{inv.senderId?.username}</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button size='sm' onClick={() => actOnInvite({ inviteId: inv._id, action: 'accept' })}>Accept</Button>
              <Button size='sm' variant='destructive' onClick={() => actOnInvite({ inviteId: inv._id, action: 'reject' })}>Reject</Button>
            </div>
          </div>
        ))}
        {(!invites || invites.length === 0) && (
          <div className='px-3 py-4 text-sm text-white/60'>No notifications.</div>
        )}
      </div>
    </div>
  );
};
