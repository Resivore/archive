import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

async function getConfig() {
  const res = await fetch('/.netlify/functions/config');
  return res.json();
}

const { SUPABASE_URL, SUPABASE_ANON_KEY } = await getConfig();
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
