
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = () =>
  SUPABASE_URL.startsWith('https://') && SUPABASE_URL.includes('.supabase.co') && SUPABASE_ANON_KEY.length > 50;

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }

  return supabase;
}

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase não configurado.' };
  }

  try {
    const client = requireSupabase();
    const { error } = await client.auth.getSession();
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Cliente Supabase configurado.' };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function saveToCloud(userId: string, gameState: any) {
  if (!isSupabaseConfigured()) return;

  const client = requireSupabase();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('Sessão inválida. Faça login novamente.');
  }

  if (user.id !== userId) {
    throw new Error('Operação negada: o save precisa pertencer ao usuário autenticado.');
  }

  const payload = {
    id: user.id,
    game_state: gameState,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from('saves').upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('Falha na sincronização cloud:', error.message);
    throw error;
  }
}

export async function loadFromCloud(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const client = requireSupabase();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('Sessão inválida. Faça login novamente.');
  }

  if (user.id !== userId) {
    throw new Error('Operação negada: o save precisa pertencer ao usuário autenticado.');
  }

  const { data, error } = await client
    .from('saves')
    .select('game_state')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao baixar da nuvem:', error.message);
    throw error;
  }

  return data?.game_state || null;
}
