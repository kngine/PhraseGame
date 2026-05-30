import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { Celebration } from './components/Celebration'
import { CategoryTabs } from './components/CategoryTabs'
import { SentenceSlot } from './components/SentenceSlot'
import { WordCard } from './components/WordCard'
import {
  buildSentence,
  CATEGORY_META,
  PIVOT_PHRASES,
  TARGET_WORDS,
  type PivotPhrase,
  type TargetCategory,
  type TargetWord,
} from './data/phrases'
import { useSpeech } from './hooks/useSpeech'

function App() {
  const { speak, cancel } = useSpeech()
  const [selectedPivot, setSelectedPivot] = useState<PivotPhrase | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<TargetWord | null>(null)
  const [category, setCategory] = useState<TargetCategory>('animals')
  const [celebrating, setCelebrating] = useState(false)

  const sentenceComplete = selectedPivot !== null && selectedTarget !== null
  const fullSentence = useMemo(
    () =>
      selectedPivot && selectedTarget
        ? buildSentence(selectedPivot, selectedTarget)
        : '',
    [selectedPivot, selectedTarget],
  )

  const filteredTargets = useMemo(
    () => TARGET_WORDS.filter((w) => w.category === category),
    [category],
  )

  const handlePivotSelect = useCallback(
    (pivot: PivotPhrase) => {
      setSelectedPivot(pivot)
      speak(pivot.text)
    },
    [speak],
  )

  const handleTargetSelect = useCallback(
    (target: TargetWord) => {
      setSelectedTarget(target)
      speak(target.text)
    },
    [speak],
  )

  const handleClear = useCallback(() => {
    cancel()
    setCelebrating(false)
    setSelectedPivot(null)
    setSelectedTarget(null)
  }, [cancel])

  const handlePlay = useCallback(() => {
    if (!sentenceComplete || !fullSentence) return

    cancel()
    speak(fullSentence, {
      rate: 0.8,
      onEnd: () => setCelebrating(false),
    })
    setCelebrating(true)
  }, [sentenceComplete, fullSentence, speak, cancel])

  return (
    <LayoutGroup>
    <div className="flex h-full flex-col bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500">
      <Celebration active={celebrating} />

      {/* Header / Sentence Builder */}
      <header className="flex-shrink-0 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
        <div className="mb-2 flex items-center justify-between">
          <motion.h1
            className="flex items-center gap-2 text-2xl font-black text-white drop-shadow sm:text-3xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <span className="text-3xl sm:text-4xl" aria-hidden>
              💬
            </span>
            <span className="sr-only">Sentence Builder</span>
          </motion.h1>

          <motion.button
            type="button"
            onClick={handleClear}
            whileTap={{ scale: 0.85, rotate: -15 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white/80 bg-red-400 text-3xl shadow-lg"
            aria-label="Clear and start over"
          >
            🗑️
          </motion.button>
        </div>

        <div className="rounded-3xl border-4 border-white/50 bg-white/20 p-3 shadow-inner backdrop-blur-sm sm:p-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <SentenceSlot
              label={selectedPivot?.text ?? 'Pivot phrase'}
              icon={selectedPivot?.icon}
              layoutId={selectedPivot ? `pivot-${selectedPivot.id}` : undefined}
              placeholderIcon="➕"
              accent="violet"
            />

            <motion.span
              className="text-4xl font-black text-white drop-shadow sm:text-5xl"
              animate={{ scale: sentenceComplete ? [1, 1.2, 1] : 1 }}
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

          <AnimatePresence>
            {sentenceComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex justify-center"
              >
                <motion.button
                  type="button"
                  onClick={handlePlay}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 8px 0 #ca8a04',
                      '0 12px 0 #ca8a04',
                      '0 8px 0 #ca8a04',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="flex min-h-[4.5rem] min-w-[12rem] items-center justify-center gap-3 rounded-3xl border-4 border-yellow-600 bg-yellow-400 px-8 text-white shadow-lg"
                  aria-label="Play sentence"
                >
                  <span className="text-5xl" aria-hidden>
                    ▶️
                  </span>
                  <span className="sr-only">Play</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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
        <div className="flex flex-1 items-center justify-center overflow-x-auto px-3 py-3">
          <div className="flex flex-wrap justify-center gap-3">
            {PIVOT_PHRASES.map((pivot) => (
              <WordCard
                key={pivot.id}
                icon={pivot.icon}
                label={pivot.text}
                accent="purple"
                selected={selectedPivot?.id === pivot.id}
                layoutId={`pivot-${pivot.id}`}
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
        <div className="flex-shrink-0 space-y-2 bg-amber-100 px-3 py-2">
          <p className="flex items-center justify-center gap-2 text-lg font-extrabold text-amber-700">
            <span className="text-2xl" aria-hidden>
              2️⃣
            </span>
            <span className="sr-only">Step two: pick a word</span>
          </p>
          <CategoryTabs active={category} onChange={setCategory} />
        </div>
        <div className="flex flex-1 items-center justify-center overflow-x-auto px-3 py-3">
          <motion.div
            key={category}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {filteredTargets.map((target) => {
              const accentMap: Record<TargetCategory, 'amber' | 'rose' | 'sky'> = {
                animals: 'amber',
                food: 'rose',
                clothing: 'sky',
              }
              return (
                <WordCard
                  key={target.id}
                  icon={target.icon}
                  label={target.text}
                  accent={accentMap[target.category]}
                  selected={selectedTarget?.id === target.id}
                  layoutId={`target-${target.id}`}
                  onTap={() => handleTargetSelect(target)}
                />
              )
            })}
          </motion.div>
        </div>
        <div className="flex-shrink-0 pb-3 text-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold text-white ${CATEGORY_META[category].color}`}
          >
            <span aria-hidden>{CATEGORY_META[category].icon}</span>
            <span className="sr-only">{CATEGORY_META[category].label}</span>
          </span>
        </div>
      </section>
    </div>
    </LayoutGroup>
  )
}

export default App
