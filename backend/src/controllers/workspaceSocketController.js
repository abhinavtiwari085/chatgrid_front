import { JOIN_WORKSPACE } from '../utils/common/eventConstants.js';

export default function workspaceSocketHandlers(io, socket) {
  socket.on(JOIN_WORKSPACE, async function joinWorkspaceRoomHandler(data, cb) {
    try {
      const { workspaceId } = data || {};
      if (!workspaceId) return cb?.({ success: false, message: 'workspaceId required' });
      socket.join(workspaceId);
      cb?.({ success: true, message: 'Joined workspace', data: workspaceId });
    } catch (e) {
      cb?.({ success: false, message: 'Failed to join workspace' });
      console.log(e);
    }
  });
}

