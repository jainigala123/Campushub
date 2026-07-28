import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
    if (error) {
      return res.status(404).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const payload = {
    id: req.user.id,
    full_name: req.body.full_name || null,
    email: req.user.email || null,
    avatar_url: req.body.avatar_url || null,
    bio: req.body.bio || null,
  };

  try {
    const { data, error } = await supabase.from('profiles').insert(payload).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {
  const updates = {
    full_name: req.body.full_name,
    avatar_url: req.body.avatar_url,
    bio: req.body.bio,
  };

  try {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', req.user.id).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
