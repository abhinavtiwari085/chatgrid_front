import express from 'express';

import { actOnDMInviteController, createDMInviteController, createOrGetDMController, listAllDMInvitesController, listDMInvitesController, listUserDMsController } from '../../controllers/dmController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Specific routes first to avoid being captured by '/:workspaceId'
router.post('/invite/:inviteId/:action', isAuthenticated, actOnDMInviteController);
router.post('/invite', isAuthenticated, createDMInviteController);
router.get('/invites/:workspaceId', isAuthenticated, listDMInvitesController);
router.get('/invites', isAuthenticated, listAllDMInvitesController);

// DM channel helpers
router.post('/', isAuthenticated, createOrGetDMController);
router.get('/:workspaceId', isAuthenticated, listUserDMsController);

export default router;
