import express from 'express';
import { supabase } from './db.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Anti-pause Supabase 🚀');
});

app.get('/keep-alive', async (req, res) => {
  const password = req.query.password;

  if (!password) {
    return res.status(400).json({ error: 'Password required!' });
  }

  try {
    const { data, error } = await supabase
      .from('supabase')
      .select('id, created_at, password')
      .eq('id', 1)
      .single();

    if (error) {

      console.error('RLS error:', error);
      return res.status(403).json({ error: 'Wrong password! RLS error 🔒' });
    }


    res.json({
      message: '✅ PAUSE SUCCESS! RLS verified password',
      time: new Date().toISOString(),
      row_id: data.id,
      password_match: true
    });

  } catch (error) {
    console.error('Keep-alive error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`server run : http://localhost:${port}`);
});