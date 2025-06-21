const { supabase } = require('../supabaseClient');

async function getCache(key) {
  const { data, error } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', key)
    .single();

  if (error || !data) return null;

  const now = new Date();
  if (new Date(data.expires_at) < now) return null;

  return data.value;
}

async function setCache(key, value, ttlSeconds = 3600) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await supabase
    .from('cache')
    .upsert({ key, value, expires_at: expiresAt });
}

module.exports = { getCache, setCache };
