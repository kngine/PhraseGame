import { AnimatePresence, LayoutGroup, motion, type PanInfo } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { SentenceSlot } from './components/SentenceSlot'
import { WordCard } from './components/WordCard'
import {
  buildSentence,
  PIVOT_PHRASES,
  TARGET_WORDS,
  type PivotPhrase,
  type TargetWord,
} from './data/phrases'
import { useSpeech } from './hooks/useSpeech'

const targetAccents = ['amber', 'rose', 'sky'] as const
const targetPageSize = 8

function App() {
  const { speakPivot, speakTarget, speakSentence, cancel } = useSpeech()
  const [selectedPivot, setSelectedPivot] = useState<PivotPhrase | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<TargetWord | null>(null)
  const [targetPage, setTargetPage] = useState(0)
  const [pageDirection, setPageDirection] = useState(1)

  const sentenceComplete = selectedPivot !== null && selectedTarget !== null
  const fullSentence = useMemo(
    () =>
      selectedPivot && selectedTarget
        ? buildSentence(selectedPivot, selectedTarget)
        : '',
    [selectedPivot, selectedTarget],
  )

  const targetPages = useMemo(() => {
    const pages: TargetWord[][] = []
    for (let i = 0; i < TARGET_WORDS.length; i += targetPageSize) {
      pages.push(TARGET_WORDS.slice(i, i + targetPageSize))
    }
    return pages
  }, [])

  const currentTargets = targetPages[targetPage] ?? []

  const goToTargetPage = useCallback(
    (nextPage: number) => {
      const lastPage = targetPages.length - 1
      const wrappedPage = nextPage < 0 ? lastPage : nextPage > lastPage ? 0 : nextPage
      const direction = nextPage > lastPage ? 1 : nextPage < 0 ? -1 : nextPage > targetPage ? 1 : -1
      setPageDirection(direction)
      setTargetPage(wrappedPage)
    },
    [targetPage, targetPages.length],
  )

  const handleTargetDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -60) {
        goToTargetPage(targetPage + 1)
      } else if (info.offset.x > 60) {
        goToTargetPage(targetPage - 1)
      }
    },
    [goToTargetPage, targetPage],
  )

  const handlePivotSelect = useCallback(
    (pivot: PivotPhrase) => {
      setSelectedPivot(pivot)
      speakPivot(pivot.id)
    },
    [speakPivot],
  )

  const handleTargetSelect = useCallback(
    (target: TargetWord) => {
      setSelectedTarget(target)
      speakTarget(target.id)
    },
    [speakTarget],
  )

  const handleClear = useCallback(() => {
    cancel()
    setSelectedPivot(null)
    setSelectedTarget(null)
  }, [cancel])

  const handlePlay = useCallback(() => {
    if (!sentenceComplete || !fullSentence) return

    cancel()
    speakSentence(selectedPivot!.id, selectedTarget!.id)
  }, [sentenceComplete, fullSentence, selectedPivot, selectedTarget, speakSentence, cancel])

  return (
    <LayoutGroup>
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_minmax(0,1.15fr)] overflow-hidden bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500">
      {/* Header / Sentence Builder */}
      <header className="px-2 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-3xl border-[3px] border-white/50 bg-white/20 p-2 shadow-inner backdrop-blur-sm sm:border-4 sm:p-3">
          <div className="flex min-w-0 items-center justify-center gap-1.5 sm:gap-3">
            <SentenceSlot
              label={selectedPivot?.text ?? 'Pivot phrase'}
              icon={selectedPivot?.icon}
              layoutId={selectedPivot ? `pivot-${selectedPivot.id}` : undefined}
              placeholderIcon="➕"
              accent="violet"
            />

            <motion.span
              className="text-3xl font-black text-white drop-shadow sm:text-5xl"
              animate={{ scale: sentenceComplete ? [1, 1.15, 1] : 1 }}
              aria-hidden
            >
              +
            </motion.span>

            <SentenceSlot
              label={selectedTarget?.text ?? 'Target word'}
              icon={selectedTarget?.icon}
              layoutId={selectedTarget ? `target-${selectedTarget.id}` : undefined}
              placeholderIcon="➕"
              accent="emerald"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
          <motion.button
            type="button"
            onClick={handleClear}
            whileTap={{ scale: 0.85, rotate: -15 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-white/80 bg-red-400 text-2xl shadow-lg sm:h-14 sm:w-14 sm:border-4 sm:text-3xl"
            aria-label="Clear and start over"
          >
            🗑️
          </motion.button>

          <AnimatePresence>
            {sentenceComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.button
                  type="button"
                  onClick={handlePlay}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-yellow-600 bg-yellow-400 text-white shadow-lg sm:h-14 sm:w-14 sm:border-4"
                  aria-label={`Play ${fullSentence}`}
                >
                  <span className="text-3xl sm:text-4xl" aria-hidden>
                    ▶️
                  </span>
                  <span className="sr-only">Play</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Pivot Phrases */}
      <section
        className="flex flex-1 min-h-0 flex-col border-t-4 border-white/30 bg-white/95"
        aria-label="Choose a phrase"
      >
        <div className="flex-shrink-0 bg-violet-100 px-3 py-2 text-center">
          <p className="flex items-center justify-center gap-2 text-lg font-extrabold text-violet-700">
            <span className="text-2xl" aria-hidden>
              1️⃣
            </span>
            <span className="sr-only">Step one: pick a phrase</span>
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-3">
          <div className="mx-auto grid max-w-4xl grid-cols-4 place-items-center gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-7">
            {PIVOT_PHRASES.map((pivot) => (
              <WordCard
                key={pivot.id}
                icon={pivot.icon}
                label={pivot.text}
                accent="purple"
                selected={selectedPivot?.id === pivot.id}
                onTap={() => handlePivotSelect(pivot)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Target Words */}
      <section
        className="flex flex-[1.2] min-h-0 flex-col border-t-4 border-white/30 bg-amber-50"
        aria-label="Choose a word"
      >
        <div className="flex-shrink-0 bg-amber-100 px-3 py-2">
          <p className="flex items-center justify-center gap-2 text-lg font-extrabold text-amber-700">
            <span className="text-2xl" aria-hidden>
              2️⃣
            </span>
            <span className="sr-only">Step two: pick a word</span>
          </p>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 py-2 sm:px-4 sm:py-3">
          <AnimatePresence mode="wait" custom={pageDirection}>
            <motion.div
              key={targetPage}
              custom={pageDirection}
              initial={{ opacity: 0, x: pageDirection * 90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: pageDirection * -90 }}
              transition={{ duration: 0.22 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleTargetDragEnd}
              className="grid max-w-3xl grid-cols-4 place-items-center gap-2 sm:gap-3"
            >
              {currentTargets.map((target, index) => {
                const globalIndex = targetPage * targetPageSize + index
                return (
                  <WordCard
                    key={target.id}
                    icon={target.icon}
                    label={target.text}
                    accent={targetAccents[globalIndex % targetAccents.length]}
                    selected={selectedTarget?.id === target.id}
                    onTap={() => handleTargetSelect(target)}
                  />
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-shrink-0 items-center justify-center gap-3 bg-amber-100 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
          <motion.button
            type="button"
            onClick={() => goToTargetPage(targetPage - 1)}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-amber-300 text-3xl font-black text-amber-800 shadow-md sm:h-12 sm:w-12 sm:border-4"
            aria-label="Previous word page"
          >
            ‹
          </motion.button>
          <div className="flex items-center gap-2" aria-label={`Word page ${targetPage + 1} of ${targetPages.length}`}>
            {targetPages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToTargetPage(index)}
                className={`h-3.5 w-3.5 rounded-full border-2 border-white sm:h-4 sm:w-4 ${
                  index === targetPage ? 'bg-amber-600' : 'bg-amber-200'
                }`}
                aria-label={`Go to word page ${index + 1}`}
                aria-current={index === targetPage ? 'page' : undefined}
              />
            ))}
          </div>
          <motion.button
            type="button"
            onClick={() => goToTargetPage(targetPage + 1)}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-amber-300 text-3xl font-black text-amber-800 shadow-md sm:h-12 sm:w-12 sm:border-4"
            aria-label="Next word page"
          >
            ›
          </motion.button>
        </div>
      </section>
    </div>
    </LayoutGroup>
  )
}

export default App
