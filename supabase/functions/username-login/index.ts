import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Invalid login' }, 405)

  let payload: { username?: string; password?: string }
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse({ error: 'Invalid login' }, 400)
    }
    const requestBody = body as Record<string, unknown>
    if (typeof requestBody.username !== 'string' || typeof requestBody.password !== 'string') {
      return jsonResponse({ error: 'Invalid username or password' }, 401)
    }
    payload = { username: requestBody.username, password: requestBody.password }
  } catch {
    return jsonResponse({ error: 'Invalid login' }, 400)
  }

  const username = payload.username?.trim().toLowerCase() ?? ''
  const password = payload.password ?? ''
  if (!/^[a-z0-9_]{3,32}$/.test(username) || typeof password !== 'string' || password.length < 1 || password.length > 1024) {
    return jsonResponse({ error: 'Invalid username or password' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: 'Sign-in is unavailable' }, 500)
  }

  const lookupClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data: profile, error: lookupError } = await lookupClient
    .from('user_profiles')
    .select('user_id')
    .eq('username', username)
    .maybeSingle()
  if (lookupError) return jsonResponse({ error: 'Sign-in is unavailable' }, 503)
  if (!profile) return jsonResponse({ error: 'Invalid username or password' }, 401)

  const { data: account, error: accountError } = await lookupClient.auth.admin.getUserById(profile.user_id)
  const email = account.user?.email
  const bannedUntil = account.user?.banned_until
  if (accountError) return jsonResponse({ error: 'Sign-in is unavailable' }, 503)
  if (!email || (bannedUntil && Date.parse(bannedUntil) > Date.now())) {
    return jsonResponse({ error: 'Invalid username or password' }, 401)
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data, error } = await authClient.auth.signInWithPassword({ email, password })
  if (error?.status && error.status >= 500) return jsonResponse({ error: 'Sign-in is unavailable' }, 503)
  if (error || !data.session || data.user.id !== profile.user_id) {
    return jsonResponse({ error: 'Invalid username or password' }, 401)
  }

  return jsonResponse({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  })
})
