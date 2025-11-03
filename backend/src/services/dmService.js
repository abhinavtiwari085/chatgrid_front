import { StatusCodes } from 'http-status-codes';

import { APP_LINK } from '../config/serverConfig.js';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepostiory.js';
import inviteRepository from '../repositories/inviteRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { workspaceInviteMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const createOrGetDMService = async (workspaceId, currentUserId, memberId) => {
  try {
    if (currentUserId?.toString() === memberId?.toString()) {
      throw new ClientError({
        message: 'Cannot start a DM with yourself',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMemberA = isUserMemberOfWorkspace(workspace, currentUserId);
    const isMemberB = isUserMemberOfWorkspace(workspace, memberId);
    if (!isMemberA || !isMemberB) {
      throw new ClientError({
        message: 'One or more users are not part of the workspace',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const existing = await channelRepository.getDMChannelForMembers(
      workspaceId,
      currentUserId,
      memberId
    );
    if (existing) return existing;

    const name = `dm_${currentUserId}_${memberId}`;
    const channel = await channelRepository.createDMChannel(
      workspaceId,
      currentUserId,
      memberId,
      name
    );
    return channel;
  } catch (error) {
    console.log('createOrGetDMService error', error);
    throw error;
  }
};

export const listUserDMsService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        message: 'User is not a member of the workspace',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const dms = await channelRepository.listUserDMsInWorkspace(workspaceId, userId);
    return dms;
  } catch (error) {
    console.log('listUserDMsService error', error);
    throw error;
  }
};

export const createDMInviteService = async (workspaceId, senderId, email) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isSenderMember = isUserMemberOfWorkspace(workspace, senderId);
    if (!isSenderMember) {
      throw new ClientError({
        message: 'User is not a member of the workspace',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const receiver = await userRepository.getByEmail(email);
    if (!receiver) {
      throw new ClientError({
        message: 'User with the given email not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    if (receiver._id.toString() === senderId.toString()) {
      throw new ClientError({
        message: 'Cannot invite yourself',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const existingPending = await inviteRepository.findPendingByUsers(
      workspaceId,
      senderId,
      receiver._id
    );
    const reversePending = await inviteRepository.findPendingByUsers(
      workspaceId,
      receiver._id,
      senderId
    );
    if (existingPending) return existingPending;
    if (reversePending) return reversePending;

    const invite = await inviteRepository.create({
      workspaceId,
      senderId,
      receiverId: receiver._id,
      inviteType: 'dm'
    });
    return invite;
  } catch (error) {
    console.log('createDMInviteService error', error);
    throw error;
  }
};

export const listDMInvitesService = async (workspaceId, userId) => {
  try {
    const invites = await inviteRepository.listPendingForUser(workspaceId, userId);
    return invites;
  } catch (error) {
    console.log('listDMInvitesService error', error);
    throw error;
  }
};

export const listAllDMInvitesService = async (userId) => {
  try {
    const invites = await inviteRepository.listPendingForUserAll(userId);
    return invites;
  } catch (error) {
    console.log('listAllDMInvitesService error', error);
    throw error;
  }
};

export const actOnDMInviteService = async (inviteId, action) => {
  try {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    const updated = await inviteRepository.updateStatus(inviteId, status);
    if (status === 'accepted') {
      // ensure both are workspace members; add if missing
      const workspace = await workspaceRepository.getWorkspaceDetailsById(updated.workspaceId);
      const senderId = updated.senderId._id.toString();
      const receiverId = updated.receiverId._id.toString();
      const senderMember = isUserMemberOfWorkspace(workspace, senderId);
      const receiverMember = isUserMemberOfWorkspace(workspace, receiverId);
      if (!senderMember) {
        await workspaceRepository.addMemberToWorkspace(updated.workspaceId, updated.senderId._id, 'member');
      }
      if (!receiverMember) {
        await workspaceRepository.addMemberToWorkspace(updated.workspaceId, updated.receiverId._id, 'member');
      }
      if (updated.inviteType === 'dm') {
        await createOrGetDMService(updated.workspaceId, updated.senderId._id, updated.receiverId._id);
      }
    }
    return updated;
  } catch (error) {
    console.log('actOnDMInviteService error', error);
    throw error;
  }
};

export const createWorkspaceInviteService = async (workspaceId, senderId, email) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const senderMember = isUserMemberOfWorkspace(workspace, senderId);
    if (!senderMember) {
      throw new ClientError({
        message: 'User is not a member of the workspace',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const receiver = await userRepository.getByEmail(email);
    if (!receiver) {
      throw new ClientError({
        message: 'User with the given email not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    if (receiver._id.toString() === senderId.toString()) {
      throw new ClientError({
        message: 'Cannot invite yourself',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const existingPending = await inviteRepository.findPendingByUsers(
      workspaceId,
      senderId,
      receiver._id
    );
    const reversePending = await inviteRepository.findPendingByUsers(
      workspaceId,
      receiver._id,
      senderId
    );
    if (existingPending) return existingPending;
    if (reversePending) return reversePending;

    const invite = await inviteRepository.create({
      workspaceId,
      senderId,
      receiverId: receiver._id,
      inviteType: 'workspace'
    });
    // Send email with join link
    try {
      const inviteLink = `${APP_LINK}/workspaces/join/${workspace._id}?autoJoin=true&joinCode=${workspace.joinCode}`;
      await addEmailtoMailQueue({
        ...workspaceInviteMail({ workspace, sender: senderMember?.memberId || senderId, inviteLink }),
        to: receiver.email
      });
    } catch (e) {
      console.log('Failed to queue invite email', e);
    }
    return invite;
  } catch (error) {
    console.log('createWorkspaceInviteService error', error);
    throw error;
  }
};
