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
        relative flex h-[clamp(4.5rem,15vw,8.5rem)] w-[clamp(4.5rem,15vw,8.5rem)]
        flex-shrink-0 items-center justify-center rounded-[1.35rem] border-[3px] border-dashed
        sm:border-4 md:rounded-3xl
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
            <span className="text-[clamp(2.75rem,9vw,4.5rem)] leading-none" role="img" aria-hidden>
              {icon}
            </span>
            <span className="sr-only">{label}</span>
          </motion.div>
        ) : (
          <motion.span
            key="placeholder"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.35 }}
            className="text-[clamp(2.5rem,8vw,4rem)] opacity-40"
            aria-hidden
          >
            {placeholderIcon}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
