import { BellIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon } from 'lucide-react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';
import { WorkspaceSwitcher } from '@/components/organisms/Workspace/WorkspaceSwitcher';
import { useParams } from 'react-router-dom';

export const WorkspaceSidebar = () => {
    const { workspaceId } = useParams();
    return (
        <aside
            className="w-[70px] h-full bg-slack-dark flex flex-col gap-y-4 items-center pt-[10px] pb-[5px]"
        >
            <WorkspaceSwitcher />

            <SidebarButton 
                Icon={HomeIcon}
                label="Home"
                to="/home"
            />

            <SidebarButton
                Icon={MessageSquareIcon}
                label="DMs"
                to={workspaceId ? `/workspaces/${workspaceId}/dms` : undefined}
            />

            <SidebarButton
                Icon={BellIcon}
                label="Notifications"
                to={workspaceId ? `/workspaces/${workspaceId}/notifications` : undefined}
            />

            {/* More button removed as requested */}

            <div className='flex flex-col items-center justify-center mt-auto mb-5 gap-y-1'>
                <UserButton />
            </div>
            
        </aside>
    );
};
