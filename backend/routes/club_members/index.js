import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.get('/club/:clubId', async (req, res) => {
  try {
    const { data, error } = await supabase.from('club_members').select('*').eq('club_id', req.params.clubId);
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
    user_id: req.user.id,
    role: 'member',
  };

  try {
    const { data, error } = await supabase.from('club_members').insert(payload).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/club/:clubId/members/:memberId/role', authMiddleware, async (req, res) => {
  const updates = {
    role: req.body.role,
  };

  try {
    const { data, error } = await supabase.from('club_members').update(updates).eq('id', req.params.memberId).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/club/:clubId/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase.from('club_members').delete().eq('id', req.params.memberId);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
