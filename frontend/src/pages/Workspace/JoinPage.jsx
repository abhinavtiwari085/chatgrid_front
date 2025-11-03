import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import VerificationInput from 'react-verification-input';

import { Button } from '@/components/ui/button';
import { useJoinWorkspaceRequest } from '@/hooks/apis/workspaces/useJoinWorkspace';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/context/useAuth';

export const JoinPage = () => {

    const { workspaceId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { auth } = useAuth();

    const { joinWorkspaceMutation } = useJoinWorkspaceRequest(workspaceId);

    async function handleAddMemberToWorkspace(joinCode) {
        console.log('Adding member to workspace', joinCode);
        try {
            await joinWorkspaceMutation(joinCode);
            toast({
                title: 'You have been added to workspace successfully',
                type: 'success'
            });

            navigate(`/workspaces/${workspaceId}`);

        } catch(error) {
            console.log('Error in adding member to workspace', error);
        }
    }

    // Auto-join if joinCode provided in URL
    const autoJoin = searchParams.get('autoJoin');
    const codeFromLink = searchParams.get('joinCode');
    
    useEffect(() => {
        if (autoJoin === 'true' && codeFromLink) {
            if (auth?.token) {
                handleAddMemberToWorkspace(codeFromLink);
            } else {
                try {
                    localStorage.setItem('pendingWorkspaceJoin', JSON.stringify({ workspaceId, joinCode: codeFromLink }));
                } catch {}
                navigate('/auth/signin');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoJoin, codeFromLink, auth?.token, workspaceId]);

    return (
        <div
            className="h-[100vh] flex flex-col gap-y-8 items-center justify-center p-8 bg-white rounded-lg shadow-sm"
        >
            <div
                className="flex flex-col gap-y-4 items-center justify-center"
            >
                <div
                    className='flex flex-col gap-y-2 items-center'
                >
                    <h1
                        className="font-bold text-3xl"
                    >
                        Join Workspace
                    </h1>

                    <p>
                        Enter the code you received to join the workspace
                    </p>
                </div>

                <VerificationInput 
                    onComplete={handleAddMemberToWorkspace}
                    length={6}
                    classNames={{
                        container: 'flex gap-x-2',
                        character: 'h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                        characterInactive: 'bg-muted',
                        characterFilled: 'bg-white text-black',
                        characterSelected: 'bg-white text-black',
                    }}
                    autoFocus
                />

            </div>

            <div
                className='flex gap-x-4'
            >
                <Button size="lg" variant="outline" >
                    <Link to={`/workspaces/${workspaceId}`}>
                        Back to the workspace
                    </Link>
                </Button>
            </div>

            
            
        </div>
    );
};
