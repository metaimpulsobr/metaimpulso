import { useCallback, useRef, useState } from 'react'
import { buildReport, fetchSignals, fetchSpeed, rememberReport, type RaioXApiError, type RaioXReport } from './raiox'
import { track } from './analytics'

export type RaioXPhase = 'idle' | 'running' | 'partial' | 'done' | 'error'

export interface RaioXState {
  phase: RaioXPhase
  url: string
  htmlDone: boolean
  speedDone: boolean
  report: RaioXReport | null
  error: RaioXApiError['error'] | null
}

const IDLE: RaioXState = { phase: 'idle', url: '', htmlDone: false, speedDone: false, report: null, error: null }

const looksLikeUrl = (v: string) => /^(https?:\/\/)?[^\s/]+\.[^\s/]{2,}/i.test(v)

/**
 * Runs the HTML check and the PageSpeed test in parallel. The report appears as soon as the HTML
 * check returns ("partial") and is recomputed when the speed test finishes ("done").
 */
export function useRaioX(location: string) {
  const [state, setState] = useState<RaioXState>(IDLE)
  const runId = useRef(0)

  const run = useCallback(
    async (input: string) => {
      const clean = input.trim()
      if (!looksLikeUrl(clean)) {
        setState({ ...IDLE, phase: 'error', url: clean, error: 'invalid_url' })
        return
      }
      const url = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`
      const id = ++runId.current
      const current = () => id === runId.current
      setState({ ...IDLE, phase: 'running', url })
      track('raiox_start', { location })

      const speedPromise = fetchSpeed(url)
      const api = await fetchSignals(url)
      if (!current()) return

      if (!api.ok && api.error !== 'network') {
        // The site itself could not be read: no point waiting for the speed test
        setState({ ...IDLE, phase: 'error', url, htmlDone: true, error: api.error })
        track('raiox_error', { location, reason: api.error })
        return
      }
      const apiOk = api.ok ? api : null
      if (apiOk) setState((s) => ({ ...s, phase: 'partial', htmlDone: true, report: buildReport(url, apiOk, null) }))
      else setState((s) => ({ ...s, htmlDone: true }))

      const speed = await speedPromise
      if (!current()) return
      if (!apiOk && !speed) {
        setState({ ...IDLE, phase: 'error', url, htmlDone: true, speedDone: true, error: 'unreachable' })
        track('raiox_error', { location, reason: 'unreachable' })
        return
      }
      const report = buildReport(url, apiOk, speed)
      rememberReport(report)
      setState({ phase: 'done', url, htmlDone: true, speedDone: true, report, error: null })
      track('raiox_result', {
        location,
        score_bucket: report.score >= 75 ? 'bom' : report.score >= 50 ? 'medio' : 'critico',
        criticos: report.findings.filter((f) => f.severity === 'critico').length,
        speed_measured: Boolean(speed),
      })
    },
    [location],
  )

  return { state, run }
}
