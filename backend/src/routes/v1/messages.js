import express from 'express';

import { getMessages, uploadToCloudinary } from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { upload } from '../../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', isAuthenticated, upload.single('file'), uploadToCloudinary);
router.get('/:channelId', isAuthenticated, getMessages);


export default router;
