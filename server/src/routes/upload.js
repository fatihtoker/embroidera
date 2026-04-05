import { Router } from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /api/upload — admin only, single image
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const ext = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filePath);

    res.json({ url: urlData.publicUrl });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/upload — admin only, delete image by path
router.delete('/', requireAuth, async (req, res, next) => {
  try {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: 'File path is required' });

    const { error } = await supabaseAdmin.storage
      .from('media')
      .remove([path]);

    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
