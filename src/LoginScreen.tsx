import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from './AuthProvider'

interface LoginScreenProps {
  sessionExpired: boolean
  startupIssue: 'network' | 'sessionExpired' | null
}

function LoginScreen({ sessionExpired, startupIssue }: LoginScreenProps) {
  const { t, i18n } = useTranslation()
  const { configured, signIn } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [error, setError] = useState<string | null>(() => configured ? null : 'configuration')
  const [dark, setDark] = useState(() => localStorage.getItem('kk-theme') === 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('kk-theme', dark ? 'dark' : 'light')
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f2119' : '#102a20')
  }, [dark])

  useEffect(() => {
    if (!configured) setError('configuration')
    else if (sessionExpired) setError('expired')
    else if (startupIssue) setError(startupIssue)
  }, [configured, sessionExpired, startupIssue])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    setError(null)
    if (!password) {
      setError('required')
      return
    }
    if (!configured) {
      setError('configuration')
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    try {
      const result = await signIn(password)
      if (result.success) {
        setPassword('')
      } else {
        setError(result.reason)
      }
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const changeLanguage = (language: string) => {
    void i18n.changeLanguage(language)
    localStorage.setItem('kk-language', language)
    document.documentElement.lang = language
  }

  const errorMessage = error ? t(`auth.errors.${error}`) : null

  return (
    <main className="login-screen">
      <div className="login-preferences">
        <button className="icon-button" type="button" onClick={() => setDark(value => !value)} aria-label={dark ? t('labels.light') : t('labels.dark')}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <select className="language-select" value={i18n.language} onChange={event => changeLanguage(event.target.value)} aria-label={t('labels.language')}>
          <option value="en">English</option><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option>
        </select>
      </div>
      <section className="login-card" aria-labelledby="login-heading">
        <img className="login-wordmark" src="/brand/kriya-kram-wordmark.png" alt={t('brand')} />
        <h1 id="login-heading">{t('auth.heading')}</h1>
        <p className="login-description">{t('auth.description')}</p>
        <form className="login-form" onSubmit={event => void submit(event)}>
          <label htmlFor="login-password">{t('auth.password')}</label>
          <div className="login-password-wrap">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={event => setPassword(event.target.value)}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'login-error' : undefined}
              disabled={submitting}
            />
            <button
              className="login-password-toggle"
              type="button"
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(value => !value)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errorMessage && <p id="login-error" className="login-error" role="alert">{errorMessage}</p>}
          <button className="button button-primary login-submit" type="submit" disabled={submitting || !configured}>
            {submitting ? t('auth.signingIn') : t('auth.login')}
          </button>
        </form>
      </section>
      <p className="login-footer">{t('auth.sharedAccountNotice')}</p>
    </main>
  )
}

export default LoginScreen
