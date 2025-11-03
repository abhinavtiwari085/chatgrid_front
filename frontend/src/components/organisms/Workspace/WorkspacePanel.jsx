import { AlertTriangleIcon, HashIcon, Loader, MessageSquareTextIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { WorkspacePanelHeader } from '@/components/molecules/Workspace/WorkspacePanelHeader';
import { WorkspacePanelSection } from '@/components/molecules/Workspace/WorkspacePanelSection';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';
import { useAuth } from '@/hooks/context/useAuth';
import { useOpenDM } from '@/hooks/apis/dms/useOpenDM';
 

export const WorkspacePanel = () => {

    const { workspaceId } = useParams();

    const { setOpenCreateChannelModal } = useCreateChannelModal();
    const { workspace, isFetching, isSuccess } = useGetWorkspaceById(workspaceId);
    const { openDM } = useOpenDM();
    const { auth } = useAuth();
    
    const generalChannelId = workspace?.channels?.find((c) => c.name?.toLowerCase() === 'general')?._id || workspace?.channels?.[0]?._id;

    if(isFetching) {

        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <Loader className='animate-spin size-6 text-white' />
            </div>
        );
    }

    if(!isSuccess) {
        return (
            <div
                className='flex flex-col gap-y-2 h-full items-center justify-center text-white'
            >
                <AlertTriangleIcon className='size-6 text-white' />
                Something went wrong
            </div>
        );
    }

    return (
        <div
            className="flex flex-col h-full bg-slack-medium"
        >
            <WorkspacePanelHeader workspace={workspace} />

            <div className='flex flex-col px-2 mt-3'>
                <SideBarItem 
                    label="Threads"
                    icon={MessageSquareTextIcon}
                    id="threads"
                    variant='active'
                />
            </div>

            <WorkspacePanelSection
                label={'Channels'}
                onIconClick={() => {setOpenCreateChannelModal(true);}}
            >
                {workspace?.channels?.map((channel) => {
                    return <SideBarItem key={channel._id} icon={HashIcon} label={channel.name} id={channel._id} />;
                })}
            </WorkspacePanelSection>

            <WorkspacePanelSection
                label="Direct messages"
                onIconClick={() => {}}
            >
                {(workspace?.members || [])
                    .filter((m) => m?.memberId?._id !== auth?.user?._id)
                    .filter((m, idx, arr) => arr.findIndex(x => x?.memberId?._id === m?.memberId?._id) === idx)
                    .map((item) => (
                        <UserItem
                            key={item.memberId._id}
                            title={item.memberId.username}
                            suffix={item.role === 'admin' ? <span className='text-emerald-500 ml-1'>Admin</span> : null}
                            id={item.memberId._id}
                            image={item.memberId.avatar}
                            onClick={() => openDM(item.memberId._id)}
                            showActive
                        />
                    ))}

                
            </WorkspacePanelSection>
        </div>
    );
};
