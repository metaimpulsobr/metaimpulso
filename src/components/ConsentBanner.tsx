import { useEffect, useState } from 'react'
import { GTM_ID, getConsent, setConsent, loadGtm } from '../lib/analytics'

// Shown only when a tracking container is configured; nothing is loaded before consent.
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GTM_ID) return
    const current = getConsent()
    if (current === 'granted') loadGtm()
    // localStorage only exists in the browser; reading it after mount keeps the prerendered HTML in sync
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (current === null) setVisible(true)
  }, [])

  if (!visible) return null

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div className="consent-banner" role="region" aria-label="Preferências de cookies">
      <p>
        Usamos cookies de análise e marketing para medir o desempenho do site e das campanhas. Saiba mais na nossa{' '}
        <a href="/politica-de-privacidade">política de privacidade</a>.
      </p>
      <div className="consent-actions">
        <button className="btn-v16 btn-v16-secondary" onClick={() => choose('denied')}>Recusar</button>
        <button className="btn-v16 btn-v16-primary" onClick={() => choose('granted')}>Aceitar</button>
      </div>
    </div>
  )
}
