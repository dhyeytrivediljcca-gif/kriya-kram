import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Ban, MailPlus, RefreshCw, RotateCcw, Trash2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabase'

interface ManagedUser {
  id: string
  email: string
  username: string
  createdAt: string
  lastSignInAt: string | null
  bannedUntil: string | null
  role: 'admin' | 'user'
}

function isDisabled(user: ManagedUser) {
  return Boolean(user.bannedUntil && Date.parse(user.bannedUntil) > Date.now())
}

function AdminUsersPage() {
  const { t, i18n } = useTranslation()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const dateLocale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN'

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    if (!supabase) {
      setLoading(false)
      setError(t('admin.errors.generic'))
      return
    }
    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{ users?: ManagedUser[] }>('admin-users', {
        body: { action: 'list' }
      })
      if (invokeError || !data?.users) {
        setError(t('admin.errors.generic'))
      } else {
        setUsers(data.users.sort((a, b) => a.email.localeCompare(b.email)))
      }
    } catch {
      setError(t('admin.errors.generic'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { void loadUsers() }, [loadUsers])

  const runAction = async (action: 'invite' | 'set-disabled' | 'delete', values: { email?: string; username?: string; userId?: string; disabled?: boolean }) => {
    if (!supabase) {
      setError(t('admin.errors.generic'))
      return false
    }
    setError('')
    setMessage('')
    try {
      const { error: invokeError } = await supabase.functions.invoke('admin-users', {
        body: { action, ...values }
      })
      if (invokeError) {
        setError(t('admin.errors.generic'))
        return false
      }
      return true
    } catch {
      setError(t('admin.errors.generic'))
      return false
    }
  }

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWorking(true)
    const success = await runAction('invite', { email, username })
    if (success) {
      setEmail('')
      setUsername('')
      setMessage(t('admin.inviteSent'))
      await loadUsers()
    }
    setWorking(false)
  }

  const sendPasswordReset = async (user: ManagedUser) => {
    if (!supabase) return
    setWorking(true)
    setError('')
    setMessage('')
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/set-password?type=recovery`
      })
      if (resetError) setError(t('admin.errors.generic'))
      else setMessage(t('admin.resetSent'))
    } catch {
      setError(t('admin.errors.generic'))
    } finally {
      setWorking(false)
    }
  }

  const toggleDisabled = async (user: ManagedUser) => {
    setWorking(true)
    const disabled = isDisabled(user)
    if (await runAction('set-disabled', { userId: user.id, disabled: !disabled })) {
      setMessage(t(disabled ? 'admin.userEnabled' : 'admin.userDisabled'))
      await loadUsers()
    }
    setWorking(false)
  }

  const deleteUser = async (user: ManagedUser) => {
    if (!window.confirm(t('admin.confirmDelete', { email: user.email }))) return
    setWorking(true)
    if (await runAction('delete', { userId: user.id })) {
      setMessage(t('admin.userDeleted'))
      await loadUsers()
    }
    setWorking(false)
  }

  return (
    <section className="admin-page">
      <div className="page-heading">
        <div><div className="eyebrow">{t('brand')}</div><h1>{t('nav.admin')}</h1><p className="page-subtitle">{t('admin.description')}</p></div>
        <button className="icon-button" type="button" onClick={() => void loadUsers()} disabled={loading || working} aria-label={t('admin.refresh')}><RefreshCw size={17} /></button>
      </div>
      <form className="admin-invite" onSubmit={event => void invite(event)}>
        <label htmlFor="invite-username">{t('admin.username')}</label>
        <div className="admin-invite-controls">
          <input id="invite-username" type="text" autoComplete="off" autoCapitalize="none" autoCorrect="off" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_]{3,32}" value={username} onChange={event => setUsername(event.target.value)} placeholder={t('admin.usernamePlaceholder')} disabled={working} />
        </div>
        <label htmlFor="invite-email">{t('admin.email')}</label>
        <div className="admin-invite-controls">
          <input id="invite-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder={t('admin.emailPlaceholder')} disabled={working} />
          <button className="button button-primary" type="submit" disabled={working}><MailPlus size={16} />{t('admin.invite')}</button>
        </div>
      </form>
      <p className="admin-guidance">{t('admin.inviteHelp')}</p>
      {error && <p className="admin-message admin-error" role="alert">{error}</p>}
      {message && <p className="admin-message" role="status">{message}</p>}
      <div className="admin-user-list" aria-live="polite">
        {loading ? <p className="loading-state">{t('admin.loading')}</p> : users.length ? users.map(user => {
          const disabled = isDisabled(user)
          return <article className="admin-user-row" key={user.id}>
            <div className="admin-user-info">
              <strong>{user.username ? `@${user.username}` : user.email}</strong>
              <span className="admin-user-email">{user.email}</span>
              <span>{user.role === 'admin' ? t('admin.administrator') : disabled ? t('admin.disabled') : t('admin.active')} · {t('admin.joined', { date: new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium' }).format(new Date(user.createdAt)) })}</span>
            </div>
            <div className="admin-user-actions">
              <button className="icon-button" type="button" onClick={() => void sendPasswordReset(user)} disabled={working || user.role === 'admin'} aria-label={t('admin.resetPassword')} title={t('admin.resetPassword')}><RotateCcw size={16} /></button>
              <button className="icon-button" type="button" onClick={() => void toggleDisabled(user)} disabled={working || user.role === 'admin'} aria-label={t(disabled ? 'admin.enableUser' : 'admin.disableUser')} title={t(disabled ? 'admin.enableUser' : 'admin.disableUser')}><Ban size={16} /></button>
              <button className="icon-button admin-delete-button" type="button" onClick={() => void deleteUser(user)} disabled={working || user.role === 'admin'} aria-label={t('admin.deleteUser')} title={t('admin.deleteUser')}><Trash2 size={16} /></button>
            </div>
          </article>
        }) : <div className="admin-empty"><Users size={22} /><p>{t('admin.empty')}</p></div>}
      </div>
    </section>
  )
}

export default AdminUsersPage
