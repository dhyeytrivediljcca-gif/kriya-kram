import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabase'

function SetPasswordScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError(t('admin.errors.passwordLength'))
      return
    }
    if (password !== confirmation) {
      setError(t('admin.errors.passwordMismatch'))
      return
    }
    if (!supabase) {
      setError(t('admin.errors.generic'))
      return
    }
    setWorking(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(t('admin.errors.generic'))
        return
      }
    } catch {
      setError(t('admin.errors.generic'))
      return
    } finally {
      setWorking(false)
    }
    setPassword('')
    setConfirmation('')
    if (searchParams.get('type') === 'invite') {
      setMessage(t('admin.passwordSet'))
      window.setTimeout(() => navigate('/today', { replace: true }), 900)
    } else {
      setMessage(t('admin.passwordUpdated'))
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card" aria-labelledby="set-password-heading">
        <img className="login-wordmark" src="/brand/kriya-kram-wordmark.png" alt={t('brand')} />
        <h1 id="set-password-heading">{t(searchParams.get('type') === 'invite' ? 'admin.setPasswordHeading' : 'admin.resetPasswordHeading')}</h1>
        <form className="login-form" onSubmit={event => void submit(event)}>
          <label htmlFor="new-password">{t('admin.newPassword')}</label>
          <div className="login-password-wrap"><input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} disabled={working} /></div>
          <label htmlFor="confirm-password">{t('admin.confirmPassword')}</label>
          <div className="login-password-wrap"><input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={working} /></div>
          {error && <p className="login-error" role="alert">{error}</p>}
          {message && <p className="login-success" role="status">{message}</p>}
          <button className="button button-primary login-submit" type="submit" disabled={working}>{working ? t('admin.savingPassword') : t('admin.savePassword')}</button>
        </form>
      </section>
    </main>
  )
}

export default SetPasswordScreen
