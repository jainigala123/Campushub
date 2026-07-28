import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { supabase } from '../../supabaseClient.js';

const router = express.Router();

router.post('/:eventId/register', authMiddleware, async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const { data: event, error: eventError } = await supabase.from('events').select('capacity').eq('id', eventId).single();
    if (eventError) {
      return res.status(404).json({ error: eventError.message });
    }

    if (event.capacity !== null) {
      const { count, error: countError } = await supabase.from('event_registrations').select('*', { count: 'exact' }).eq('event_id', eventId);
      if (countError) {
        throw countError;
      }
      if (count >= event.capacity) {
        return res.status(409).json({ error: 'Event capacity reached' });
      }
    }

    const { data, error } = await supabase.from('event_registrations').insert({ event_id: eventId, user_id: req.user.id }).select().single();
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:eventId/register', authMiddleware, async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const { error } = await supabase.from('event_registrations').delete().match({ event_id: eventId, user_id: req.user.id });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:eventId/attendees', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const { data, error } = await supabase.from('event_registrations').select('user_id').eq('event_id', eventId);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
