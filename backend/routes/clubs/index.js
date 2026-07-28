import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, search, limit = 20, offset = 0 } = req.query;
  try {
    let query = supabase.from('clubs').select('*');
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('clubs').select('*').eq('id', req.params.id).single();
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const payload = {
    name: req.body.name,
    description: req.body.description || null,
    category: req.body.category || null,
    website: req.body.website || null,
    logo_url: req.body.logo_url || null,
    owner_id: req.user.id,
    is_approved: req.body.is_approved ?? false,
  };

  try {
    const { data, error } = await supabase.from('clubs').insert(payload).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const updates = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    website: req.body.website,
    logo_url: req.body.logo_url,
    is_approved: req.body.is_approved,
  };

  try {
    const { data, error } = await supabase.from('clubs').update(updates).eq('id', req.params.id).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase.from('clubs').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('clubs').update({ is_approved: true }).eq('id', req.params.id).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
