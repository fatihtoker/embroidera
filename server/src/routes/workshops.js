import { Router } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/workshops — public, published only
router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/workshops/all — admin, all statuses
router.get('/all', requireAuth, async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('workshops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/workshops/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Workshop not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/workshops — admin only
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('workshops')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/workshops/:id — admin only
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('workshops')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Workshop not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workshops/:id — admin only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin
      .from('workshops')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
