import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { club_id, upcoming, search, limit = 20, offset = 0 } = req.query;
  try {
    let query = supabase.from('events').select('*');

    if (club_id) query = query.eq('club_id', club_id);
    if (upcoming === 'true') query = query.gt('event_date', new Date().toISOString());
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('events').select('*').eq('id', req.params.id).single();
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
    club_id: req.body.club_id,
    title: req.body.title,
    description: req.body.description || null,
    location: req.body.location || null,
    event_date: req.body.event_date,
    capacity: req.body.capacity || null,
    is_published: req.body.is_published ?? true,
  };

  try {
    const { data, error } = await supabase.from('events').insert(payload).select().single();
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
    description: req.body.description,
    location: req.body.location,
    event_date: req.body.event_date,
    capacity: req.body.capacity,
    is_published: req.body.is_published,
  };

  try {
    const { data, error } = await supabase.from('events').update(updates).eq('id', req.params.id).select().single();
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
    const { error } = await supabase.from('events').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
