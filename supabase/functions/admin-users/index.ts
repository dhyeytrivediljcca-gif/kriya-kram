import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return response({ error: 'Unauthorized' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response({ error: 'Server configuration is incomplete' }, 500)
  }

  const token = authorization.slice('Bearer '.length)
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } }
  })
  const { data: { user }, error: authError } = await authClient.auth.getUser(token)
  if (authError || !user || user.app_metadata?.role !== 'admin') {
    return response({ error: 'Forbidden' }, 403)
  }

  let body: { action?: string; email?: string; username?: string; userId?: string; disabled?: boolean }
  try {
    const parsed: unknown = await request.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return response({ error: 'Invalid request body' }, 400)
    }
    const requestBody = parsed as Record<string, unknown>
    body = {
      action: typeof requestBody.action === 'string' ? requestBody.action : undefined,
      email: typeof requestBody.email === 'string' ? requestBody.email : undefined,
      username: typeof requestBody.username === 'string' ? requestBody.username : undefined,
      userId: typeof requestBody.userId === 'string' ? requestBody.userId : undefined,
      disabled: typeof requestBody.disabled === 'boolean' ? requestBody.disabled : undefined
    }
  } catch {
    return response({ error: 'Invalid request body' }, 400)
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  if (body.action === 'list') {
    const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (error) return response({ error: 'Could not list users' }, 500)
    const { data: profiles, error: profileError } = await adminClient
      .from('user_profiles')
      .select('user_id, username')
    if (profileError) return response({ error: 'Could not list users' }, 500)
    const usernames = new Map(profiles.map(profile => [profile.user_id, profile.username]))
    return response({
      users: data.users.map(account => ({
        id: account.id,
        email: account.email ?? '',
        username: usernames.get(account.id) ?? '',
        createdAt: account.created_at,
        lastSignInAt: account.last_sign_in_at ?? null,
        bannedUntil: account.banned_until ?? null,
        role: account.app_metadata?.role === 'admin' ? 'admin' : 'user'
      }))
    })
  }

  if (body.action === 'invite') {
    const email = body.email?.trim().toLowerCase() ?? ''
    const username = body.username?.trim().toLowerCase() ?? ''
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response({ error: 'Invalid email address' }, 400)
    }
    if (!/^[a-z0-9_]{3,32}$/.test(username)) {
      return response({ error: 'Invalid username' }, 400)
    }

    const appSiteUrl = Deno.env.get('APP_SITE_URL')
    if (!appSiteUrl) return response({ error: 'Server configuration is incomplete' }, 500)
    let redirectTo: string
    try {
      redirectTo = new URL('/set-password?type=invite', appSiteUrl).toString()
    } catch {
      return response({ error: 'Server configuration is invalid' }, 500)
    }
    const { data: invitation, error } = await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo })
    if (error) return response({ error: 'Could not invite user' }, 400)
    if (!invitation.user) return response({ error: 'Could not invite user' }, 500)
    const { error: profileError } = await adminClient.from('user_profiles').insert({
      user_id: invitation.user.id,
      username
    })
    if (profileError) {
      const { error: cleanupError } = await adminClient.auth.admin.deleteUser(invitation.user.id)
      if (cleanupError) return response({ error: 'Could not finish account setup' }, 500)
      return response({ error: 'Username is unavailable' }, 409)
    }
    return response({ success: true })
  }

  if (body.action === 'set-disabled' || body.action === 'delete') {
    const userId = body.userId?.trim() ?? ''
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return response({ error: 'Invalid user ID' }, 400)
    }
    if (userId === user.id) return response({ error: 'You cannot remove your own admin account' }, 400)

    const { data: target, error: targetError } = await adminClient.auth.admin.getUserById(userId)
    if (targetError || !target.user) return response({ error: 'User not found' }, 404)
    if (target.user.app_metadata?.role === 'admin') {
      return response({ error: 'Admin accounts cannot be disabled or deleted here' }, 400)
    }

    if (body.action === 'delete') {
      const { error } = await adminClient.auth.admin.deleteUser(userId)
      if (error) return response({ error: 'Could not delete user' }, 500)
      return response({ success: true })
    }

    if (typeof body.disabled !== 'boolean') return response({ error: 'Invalid account status' }, 400)
    const disabled = body.disabled
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      ban_duration: disabled ? '876000h' : 'none'
    })
    if (error) return response({ error: 'Could not update user access' }, 500)
    return response({ success: true })
  }

  return response({ error: 'Unsupported action' }, 400)
})
