const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nim, legion } = req.body;

    if (!nim || !legion) {
      return res.status(400).json({ error: 'NIM dan Legion harus diisi' });
    }

    const { data: peserta, error } = await supabase
      .from('peserta')
      .select('nim, nama, legion, lolos_kkm')
      .eq('nim', nim)
      .eq('legion', legion)
      .single();

    if (error || !peserta) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    return res.status(200).json({ peserta });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
