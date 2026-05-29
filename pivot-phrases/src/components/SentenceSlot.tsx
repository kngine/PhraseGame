import { AnimatePresence, motion } from 'framer-motion'

type SentenceSlotProps = {
  label: string
  icon?: string
  layoutId?: string
  placeholderIcon: string
  accent: 'violet' | 'emerald'
}

const slotStyles = {
  violet: 'border-violet-400 bg-violet-50/80',
  emerald: 'border-emerald-400 bg-emerald-50/80',
}

export function SentenceSlot({
  label,
  icon,
  layoutId,
  placeholderIcon,
  accent,
}: SentenceSlotProps) {
  return (
    <div
      className={`
        relative flex h-[7.5rem] w-[7.5rem] flex-shrink-0 items-center justify-center
        rounded-3xl border-4 border-dashed sm:h-[8.5rem] sm:w-[8.5rem]
        ${slotStyles[accent]}
      `}
      aria-label={icon ? label : `Empty slot: ${label}`}
    >
      <AnimatePresence mode="popLayout">
        {icon ? (
          <motion.div
            key={layoutId ?? label}
            layoutId={layoutId}
            initial={{ scale: 0.3, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl sm:text-7xl" role="img" aria-hidden>
              {icon}
            </span>
            <span className="sr-only">{label}</span>
          </motion.div>
        ) : (
          <motion.span
            key="placeholder"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.35 }}
            className="text-5xl opacity-40 sm:text-6xl"
            aria-hidden
          >
            {placeholderIcon}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
