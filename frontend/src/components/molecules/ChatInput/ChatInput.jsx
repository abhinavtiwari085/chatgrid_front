import { uploadToCloudinary } from '@/apis/uploads';
import { Editor } from '@/components/atoms/Editor/Edtior';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useSocket } from '@/hooks/context/useSocket';

export const ChatInput = () => {

    const { socket, currentChannel } = useSocket();
    const { auth } = useAuth();
    const { currentWorkspace } = useCurrentWorkspace();
    

    async function handleSubmit({ body, image }) {
        console.log(body, image);
        let fileUrl = null;
        if(image) {
            const uploadResponse = await uploadToCloudinary({ token: auth?.token, file: image });
            console.log('cloudinary upload response', uploadResponse);
            fileUrl = uploadResponse?.url || null;
        }
        socket?.emit('NewMessage', {
            channelId: currentChannel,
            body,
            image: fileUrl,
            senderId: auth?.user?._id,
            workspaceId: currentWorkspace?._id
        }, (data) => {
            console.log('Message sent', data);
        });
    }

    return (
        <div
            className="px-5 w-full"
        >
            <Editor 
                placeholder="Type a message..."
                onSubmit={handleSubmit}
                onCancel={() => {}}
                disabled={false}
                defaultValue=""
                
            />

            
        </div>
    );
};
