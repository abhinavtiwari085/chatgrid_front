import express from 'express';

import channelRouter from './channel.js';
import dmRouter from './dm.js';
import memberRouter from './members.js';
import messageRouter from './messages.js';
import userRouter from './users.js';
import workspaceRouter from './workspaces.js';
const router = express.Router();

router.use('/users', userRouter);

router.use('/workspaces', workspaceRouter);

router.use('/channels', channelRouter);
router.use('/dms', dmRouter);

router.use('/members', memberRouter);

router.use('/messages', messageRouter);

// payments route removed

export default router;
