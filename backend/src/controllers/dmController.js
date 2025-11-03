import { StatusCodes } from 'http-status-codes';

import { actOnDMInviteService, createDMInviteService, createOrGetDMService, listAllDMInvitesService, listDMInvitesService, listUserDMsService } from '../services/dmService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const createOrGetDMController = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.body;
    const response = await createOrGetDMService(workspaceId, req.user, memberId);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'DM channel ready'));
  } catch (error) {
    console.log('createOrGetDMController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const listUserDMsController = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const response = await listUserDMsService(workspaceId, req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'DM channels fetched'));
  } catch (error) {
    console.log('listUserDMsController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const createDMInviteController = async (req, res) => {
  try {
    const { workspaceId, email } = req.body;
    const invite = await createDMInviteService(workspaceId, req.user, email);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(invite, 'Invite sent'));
  } catch (error) {
    console.log('createDMInviteController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const listDMInvitesController = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const invites = await listDMInvitesService(workspaceId, req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(invites, 'Invites fetched'));
  } catch (error) {
    console.log('listDMInvitesController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const listAllDMInvitesController = async (req, res) => {
  try {
    const invites = await listAllDMInvitesService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(invites, 'Invites fetched'));
  } catch (error) {
    console.log('listAllDMInvitesController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const actOnDMInviteController = async (req, res) => {
  try {
    const { inviteId, action } = req.params;
    const updated = await actOnDMInviteService(inviteId, action);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(updated, `Invite ${action}ed`));
  } catch (error) {
    console.log('actOnDMInviteController error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
