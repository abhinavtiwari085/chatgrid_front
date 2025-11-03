import fs from 'fs';
import multer from 'multer';
import path from 'path';

import { TEMP_UPLOAD_DIR } from '../config/serverConfig.js';

const defaultTempDir = TEMP_UPLOAD_DIR || 'D:\\Code\\Projects\\MessageSlackTest\\frontend\\public\\assets';

if (!fs.existsSync(defaultTempDir)) {
  fs.mkdirSync(defaultTempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, defaultTempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || '') || '';
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({ storage });

