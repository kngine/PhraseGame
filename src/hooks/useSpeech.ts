import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const voicesReady = useRef(false)

  useEffect(() => {
    const loadVoices = () => {
      voicesReady.current = true
    }
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    loadVoices()
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices()
    const preferred =
      voices.find((v) => v.lang.startsWith('en') && v.name.includes('Female')) ??
      voices.find((v) => v.lang.startsWith('en-US')) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      voices[0]
    return preferred ?? null
  }, [])

  const speak = useCallback(
    (text: string, options?: { rate?: number; onEnd?: () => void }) => {
      if (!('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options?.rate ?? 0.85
      utterance.pitch = 1.1
      utterance.volume = 1

      const voice = pickVoice()
      if (voice) utterance.voice = voice

      if (options?.onEnd) {
        utterance.onend = options.onEnd
        utterance.onerror = options.onEnd
      }

      window.speechSynthesis.speak(utterance)
    },
    [pickVoice],
  )

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel()
  }, [])

  return { speak, cancel }
}
