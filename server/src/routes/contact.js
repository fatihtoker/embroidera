import { Router } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/contact — public
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert({ name, email, subject, message });

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/contact — admin only, list messages
router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/contact/:id/read — mark as read
router.put('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .update({ read: true })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contact/:id — admin only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
