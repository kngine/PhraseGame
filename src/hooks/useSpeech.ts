import { useCallback, useEffect, useRef } from 'react'

type SpeakOptions = {
  onEnd?: () => void
}

type SpeechClip = {
  buffer: AudioBuffer
  offset: number
  duration: number
}

type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

const silenceThreshold = 0.012
const trimPaddingSeconds = 0.02
const joinOverlapSeconds = 0.04

function audioUrl(category: 'pivots' | 'targets', id: string): string {
  return `/audio/${category}/${id}.m4a`
}

function getAudioContext(): AudioContext {
  const audioWindow = window as AudioContextWindow
  const AudioContextClass = audioWindow.AudioContext ?? audioWindow.webkitAudioContext
  if (!AudioContextClass) {
    throw new Error('Web Audio is not supported')
  }
  return new AudioContextClass()
}

function trimSilence(buffer: AudioBuffer): SpeechClip {
  let firstSound = 0
  let lastSound = buffer.length - 1

  for (let i = 0; i < buffer.length; i++) {
    let isSound = false
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      if (Math.abs(buffer.getChannelData(channel)[i]) > silenceThreshold) {
        isSound = true
        break
      }
    }
    if (isSound) {
      firstSound = i
      break
    }
  }

  for (let i = buffer.length - 1; i >= firstSound; i--) {
    let isSound = false
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      if (Math.abs(buffer.getChannelData(channel)[i]) > silenceThreshold) {
        isSound = true
        break
      }
    }
    if (isSound) {
      lastSound = i
      break
    }
  }

  const paddingFrames = Math.round(trimPaddingSeconds * buffer.sampleRate)
  const startFrame = Math.max(0, firstSound - paddingFrames)
  const endFrame = Math.min(buffer.length, lastSound + paddingFrames)

  return {
    buffer,
    offset: startFrame / buffer.sampleRate,
    duration: Math.max(0.05, (endFrame - startFrame) / buffer.sampleRate),
  }
}

export function useSpeech() {
  const audioContext = useRef<AudioContext | null>(null)
  const activeSources = useRef<AudioBufferSourceNode[]>([])
  const clipCache = useRef(new Map<string, Promise<SpeechClip>>())
  const queueId = useRef(0)

  const loadClip = useCallback(async (src: string) => {
    const context = audioContext.current ?? getAudioContext()
    audioContext.current = context

    const cached = clipCache.current.get(src)
    if (cached) return cached

    const clipPromise = fetch(src)
      .then((response) => response.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .then(trimSilence)

    clipCache.current.set(src, clipPromise)
    return clipPromise
  }, [])

  useEffect(() => {
    return () => {
      queueId.current += 1
      activeSources.current.forEach((source) => source.stop())
      activeSources.current = []
    }
  }, [])

  const cancel = useCallback(() => {
    queueId.current += 1
    activeSources.current.forEach((source) => source.stop())
    activeSources.current = []
  }, [])

  const playSequence = useCallback(
    async (sources: string[], options?: SpeakOptions) => {
      const id = ++queueId.current

      try {
        const context = audioContext.current ?? getAudioContext()
        audioContext.current = context
        await context.resume()

        const clips = await Promise.all(sources.map(loadClip))
        if (id !== queueId.current) return

        activeSources.current = []
        let startAt = context.currentTime + 0.02

        clips.forEach((clip, index) => {
          const source = context.createBufferSource()
          source.buffer = clip.buffer
          source.connect(context.destination)
          source.start(startAt, clip.offset, clip.duration)
          activeSources.current.push(source)

          if (index === clips.length - 1) {
            source.onended = () => {
              if (id === queueId.current) {
                activeSources.current = []
                options?.onEnd?.()
              }
            }
          }

          startAt += Math.max(0.05, clip.duration - joinOverlapSeconds)
        })
      } catch {
        if (id === queueId.current) {
          activeSources.current = []
          options?.onEnd?.()
        }
      }
    },
    [loadClip],
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
