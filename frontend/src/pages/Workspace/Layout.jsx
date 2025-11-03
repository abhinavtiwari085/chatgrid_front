import { WorkspaceNavbar } from '@/components/organisms/Workspace/WorkspaceNavbar';
import { WorkspacePanel } from '@/components/organisms/Workspace/WorkspacePanel';
import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';
import { DMList } from '@/pages/Workspace/DMs/DMList';
import { Notifications } from '@/pages/Workspace/Notifications/Notifications';
import { useLocation, useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEffect } from 'react';
import { useSocket } from '@/hooks/context/useSocket';
import { useQueryClient } from '@tanstack/react-query';

export const WorkspaceLayout = ({ children }) => {
    const location = useLocation();
    const { workspaceId } = useParams();
    const { socket, joinWorkspace } = useSocket();
    const queryClient = useQueryClient();
    const showDMListInPanel = /\/workspaces\/[^/]+\/dms\/?$/.test(location.pathname);
    const showNotificationsInPanel = /\/workspaces\/[^/]+\/notifications\/?$/.test(location.pathname);

    useEffect(() => {
        if (!workspaceId) return;
        joinWorkspace(workspaceId);
        function onWorkspaceUpdated(evt) {
            if (!evt || evt.workspaceId !== workspaceId) return;
            queryClient.invalidateQueries([`fetchWorkspaceById-${workspaceId}`]);
            queryClient.invalidateQueries(['list-dms', workspaceId]);
        }
        socket.on('WorkspaceUpdated', onWorkspaceUpdated);
        return () => {
            socket.off('WorkspaceUpdated', onWorkspaceUpdated);
        };
    }, [workspaceId, socket, joinWorkspace, queryClient]);
    return (
        <div className="h-[100vh]">
            <WorkspaceNavbar />
            <div className="flex h-[calc(100vh-40px)]">
                <WorkspaceSidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'}>
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className='bg-slack-medium'
                    >
                        {showDMListInPanel ? <DMList /> : showNotificationsInPanel ? <Notifications /> : <WorkspacePanel />}
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        minSize={20}
                    >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
                
            </div>
        </div>
    );
};
