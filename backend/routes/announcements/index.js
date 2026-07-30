import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.get('/club/:clubId', async (req, res) => {
  try {
    let query = supabase.from('announcements').select('*').eq('club_id', req.params.clubId);

    if (req.query.event_id) {
      query = query.eq('event_id', req.query.event_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/club/:clubId', authMiddleware, async (req, res) => {
  const payload = {
    club_id: req.params.clubId,
    title: req.body.title,
    content: req.body.content,
  };

  if (req.body.event_id) {
    payload.event_id = req.body.event_id;
  }

  try {
    const { data, error } = await supabase.from('announcements').insert(payload).select().single();
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
    title: req.body.title,
    content: req.body.content,
  };

  if (req.body.event_id !== undefined) {
    updates.event_id = req.body.event_id;
  }

  try {
    const { data, error } = await supabase.from('announcements').update(updates).eq('id', req.params.id).select().single();
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
    const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
