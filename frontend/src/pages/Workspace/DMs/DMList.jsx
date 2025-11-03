import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { listUserDMs } from '@/apis/dms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/context/useAuth';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

export const DMList = () => {
  const { workspaceId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { data: dms, isFetching } = useQuery({
    queryKey: ['list-dms', workspaceId],
    queryFn: () => listUserDMs({ token: auth?.token, workspaceId })
  });

  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dms || [];
    return (dms || []).filter((dm) => {
      const other = (dm.members || []).find((m) => m._id !== auth?.user?._id);
      const label = (other?.username || dm.name || '').toLowerCase();
      return label.includes(q);
    });
  }, [dms, query, auth?.user?._id]);

  if (isFetching) return <div className='p-4 text-sm text-white/60'>Loading DMs...</div>;

  return (
    <div className='flex h-full flex-col text-[#f9edffcc]'>
      <div className='px-3 pt-3'>
        <div className='text-lg font-bold text-white mb-2'>Direct messages</div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search people'
          className='max-w-full h-8 text-sm bg-white/5 border border-white/10 placeholder:text-white/40 text-white focus-visible:ring-0 focus-visible:border-white/20'
        />
      </div>
      <Separator className='my-3 bg-white/10' />
      <div className='px-1 pb-4 overflow-y-auto'>
        {(filtered || []).map((dm) => {
          const other = (dm.members || []).find((m) => m._id !== auth?.user?._id);
          const label = other?.username || dm.name;
          const avatar = other?.avatar;
          return (
            <div
              key={dm._id}
              onClick={() => navigate(`/workspaces/${workspaceId}/channels/${dm._id}`)}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer select-none',
                'hover:bg-white/10 transition-colors'
              )}
            >
              <div className='relative'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage src={avatar} />
                  <AvatarFallback className='text-[11px]'>
                    {(label || '?').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='absolute -bottom-0.5 -right-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#1a1d21]' />
              </div>
              <div className='flex-1 truncate'>
                <span className='text-base font-medium'>{label}</span>
              </div>
            </div>
          );
        })}
        {(!filtered || filtered.length === 0) && (
          <div className='px-3 py-4 text-sm text-white/60'>No matches.</div>
        )}
      </div>
    </div>
  );
};
