import { useEffect } from 'react'

interface StartupIntroProps {
  onComplete: () => void
}

function StartupIntro({ onComplete }: StartupIntroProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fallback = window.setTimeout(onComplete, reducedMotion ? 1500 : 3600)
    return () => window.clearTimeout(fallback)
  }, [onComplete])

  return (
    <div
      className="startup-intro"
      role="status"
      aria-label="क्रिया-क्रम"
      onAnimationEnd={event => {
        if (event.target === event.currentTarget && event.animationName === 'intro-exit') onComplete()
      }}
    >
      <img className="startup-wordmark" src="/brand/kriya-kram-wordmark.png" alt="" />
      <span className="startup-accent" aria-hidden="true" />
    </div>
  )
}

export default StartupIntro
