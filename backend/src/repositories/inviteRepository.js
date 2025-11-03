import Invite from '../schema/invite.js';

const inviteRepository = {
  create: async (data) => Invite.create(data),
  findPendingByUsers: async (workspaceId, senderId, receiverId) =>
    Invite.findOne({ workspaceId, senderId, receiverId, status: 'pending' }),
  listPendingForUser: async (workspaceId, userId) =>
    Invite.find({ workspaceId, receiverId: userId, status: 'pending' })
      .populate('senderId', 'username email avatar')
      .sort({ createdAt: -1 }),
  listPendingForUserAll: async (userId) =>
    Invite.find({ receiverId: userId, status: 'pending' })
      .populate('senderId', 'username email avatar')
      .populate('workspaceId', 'name')
      .sort({ createdAt: -1 }),
  updateStatus: async (inviteId, status) =>
    Invite.findByIdAndUpdate(inviteId, { status }, { new: true })
      .populate('senderId', 'username email avatar')
      .populate('receiverId', 'username email avatar')
};

export default inviteRepository;
