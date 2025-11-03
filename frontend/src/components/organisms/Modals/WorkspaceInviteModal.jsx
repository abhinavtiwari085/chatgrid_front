import { CopyIcon, SendIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/context/useAuth';
import { inviteWorkspaceByEmail } from '@/apis/workspaces';
// cleaned imports

export const WorkspaceInviteModal = ({ openInviteModal, setOpenInviteModal, workspaceName, joinCode, workspaceId }) => {
    
    const { toast } = useToast();

    const { auth } = useAuth();
    const inviteLink = `${window.location.origin}/workspaces/join/${workspaceId}?autoJoin=true&joinCode=${joinCode}`;
    const [email, setEmail] = useState('');
    

    async function handleCopy() {
        await navigator.clipboard.writeText(inviteLink);
        toast({
            title: 'Link copied to clipboard',
            type: 'success'
        });
    }

    return (
        <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invite people to {workspaceName}
                    </DialogTitle>
                    <DialogDescription>
                        Share a link or send invites by email.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-6 py-2'>
                    {/* Invite via link */}
                    <div className='flex items-center justify-between gap-3'>
                        <div className='flex flex-col'>
                            <span className='text-sm font-medium'>Invite via link</span>
                            <span className='text-xs text-muted-foreground'>Copy a link anyone can use to join.</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className='h-8 px-3 font-medium'
                          onClick={handleCopy}
                        >
                            Copy link
                            <CopyIcon className='size-4 ml-2' />
                        </Button>
                    </div>

                    {/* Invite by email */}
                    <div className='flex flex-col gap-2'>
                        <span className='text-sm font-medium'>Invite by email</span>
                        <div className='flex items-center gap-2'>
                            <Input
                                type='email'
                                placeholder='name@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='h-9'
                            />
                            <Button
                              size='sm'
                              className='h-8 px-3 font-medium'
                              disabled={!email}
                              onClick={async () => {
                                if (!email) return;
                                try {
                                  await inviteWorkspaceByEmail({ workspaceId, email, token: auth?.token });
                                  setEmail('');
                                  toast({ title: 'Invite sent', type: 'success' });
                                } catch (e) {
                                  toast({ title: 'Failed to send invite', type: 'error' });
                                }
                              }}
                            >
                              Send
                              <SendIcon className='size-4 ml-2' />
                            </Button>
                        </div>
                    </div>

                    
                </div>

            </DialogContent>
        </Dialog>
    );
};
