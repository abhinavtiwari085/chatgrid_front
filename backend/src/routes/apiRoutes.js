import express from 'express';

import v1Router from './v1/v1Router.js';

const router = express.Router();

router.use('/v1', v1Router);

// Backward compatibility: also mount v1 routes at root
// This lets frontends using baseURL '/api' (without '/v1') keep working
router.use('/', v1Router);

export default router;
