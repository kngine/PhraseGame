import { useCallback, useEffect, useRef } from 'react'

type SpeakOptions = {
  onEnd?: () => void
}

function audioUrl(category: 'pivots' | 'targets', id: string): string {
  return `/audio/${category}/${id}.m4a`
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useSpeech() {
  const activeAudio = useRef<HTMLAudioElement | null>(null)
  const queueId = useRef(0)

  useEffect(() => {
    return () => {
      queueId.current += 1
      activeAudio.current?.pause()
      activeAudio.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    queueId.current += 1
    activeAudio.current?.pause()
    activeAudio.current = null
  }, [])

  const playSequence = useCallback(
    async (sources: string[], options?: SpeakOptions) => {
      const id = ++queueId.current

      for (let i = 0; i < sources.length; i++) {
        const src = sources[i]
        if (id !== queueId.current) return

        if (i > 0) {
          await delay(180)
          if (id !== queueId.current) return
        }

        try {
          const audio = new Audio(src)
          activeAudio.current = audio
          await new Promise<void>((resolve, reject) => {
            audio.onended = () => resolve()
            audio.onerror = () => reject(new Error(`Failed to play ${src}`))
            void audio.play().catch(reject)
          })
        } catch {
          if (id === queueId.current) {
            options?.onEnd?.()
          }
          return
        }
      }

      if (id === queueId.current) {
        activeAudio.current = null
        options?.onEnd?.()
      }
    },
    [],
  )

  const speakPivot = useCallback(
    (id: string, options?: SpeakOptions) => {
      cancel()
      void playSequence([audioUrl('pivots', id)], options)
    },
    [cancel, playSequence],
  )

  const speakTarget = useCallback(
    (id: string, options?: SpeakOptions) => {
      cancel()
      void playSequence([audioUrl('targets', id)], options)
    },
    [cancel, playSequence],
  )

  const speakSentence = useCallback(
    (pivotId: string, targetId: string, options?: SpeakOptions) => {
      cancel()
      void playSequence(
        [audioUrl('pivots', pivotId), audioUrl('targets', targetId)],
        options,
      )
    },
    [cancel, playSequence],
  )

  return { speakPivot, speakTarget, speakSentence, cancel }
}
