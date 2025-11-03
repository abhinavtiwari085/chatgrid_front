import Channel from '../schema/channel.js';
import crudRepository from './crudRepository.js';

const channelRepository = {
  ...crudRepository(Channel),
  getChannelWithWorkspaceDetails: async function (channelId) {
    const channel = await Channel.findById(channelId)
      .populate('workspaceId')
      .populate('members', 'username email avatar');
    return channel;
  },
  getDMChannelForMembers: async function (workspaceId, userA, userB) {
    return Channel.findOne({
      workspaceId,
      isDM: true,
      members: { $all: [userA, userB] }
    }).populate('members', 'username email avatar');
  },
  createDMChannel: async function (workspaceId, userA, userB, name) {
    const channel = await Channel.create({
      name,
      workspaceId,
      isDM: true,
      members: [userA, userB]
    });
    return channel.populate('members', 'username email avatar');
  },
  listUserDMsInWorkspace: async function (workspaceId, userId) {
    return Channel.find({
      workspaceId,
      isDM: true,
      members: userId
    }).populate('members', 'username email avatar');
  }
};

export default channelRepository;
