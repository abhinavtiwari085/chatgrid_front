import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import { useChannelMessages } from '@/hooks/context/useChannelMessages';

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const [currentChannel, setCurrentChannel] = useState(null);
    const { messageList, setMessageList } = useChannelMessages();

    const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_SOCKET_URL), []);

    useEffect(() => {
        function onNewMessage(data) {
            console.log('New message received', data);
            setMessageList((prev) => [...prev, data]);
        }
        socket.on('NewMessageReceived', onNewMessage);
        return () => {
            socket.off('NewMessageReceived', onNewMessage);
        };
    }, [socket, setMessageList]);

    async function joinChannel(channelId) {
        socket.emit('JoinChannel', { channelId }, (data) => {
            console.log('Successfully joined the channel', data);
            setCurrentChannel(data?.data);
        });
    }

    async function joinWorkspace(workspaceId, cb) {
        socket.emit('JoinWorkspace', { workspaceId }, cb);
    }

    return (
        <SocketContext.Provider value={{socket, joinChannel, joinWorkspace, currentChannel}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
