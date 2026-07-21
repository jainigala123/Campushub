import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are not set yet.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CampusHub backend is running' });
});

app.get('/clubs', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('clubs').select('*').limit(10);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
