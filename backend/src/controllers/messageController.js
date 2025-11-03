import fs from 'fs/promises';
import { StatusCodes } from 'http-status-codes';

import cloudinary from '../config/cloudinary.js';
import { CLOUDINARY_FOLDER } from '../config/serverConfig.js';
import { getMessagesService } from '../services/messageService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesService(
      {
        channelId: req.params.channelId
      },
      req.query.page || 1,
      req.query.limit || 20,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages Fetched Successfully'));
  } catch (error) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(customErrorResponse({ message: 'No file provided' }));
    }

    const filePath = req.file.path;
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: CLOUDINARY_FOLDER || 'chatgrid'
      });
      await fs.unlink(filePath).catch(() => {});
      return res
        .status(StatusCodes.OK)
        .json(successResponse({ url: result.secure_url }, 'File uploaded successfully'));
    } catch (err) {
      await fs.unlink(filePath).catch(() => {});
      throw err;
    }
  } catch (error) {
    console.log('Error in uploadToCloudinary', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
