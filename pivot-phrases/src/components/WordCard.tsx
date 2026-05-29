import { motion } from 'framer-motion'

type WordCardProps = {
  icon: string
  label: string
  accent?: 'purple' | 'amber' | 'rose' | 'sky'
  selected?: boolean
  layoutId?: string
  onTap: () => void
}

const accentStyles = {
  purple: 'bg-violet-100 border-violet-400 shadow-violet-200',
  amber: 'bg-amber-100 border-amber-400 shadow-amber-200',
  rose: 'bg-rose-100 border-rose-400 shadow-rose-200',
  sky: 'bg-sky-100 border-sky-400 shadow-sky-200',
}

export function WordCard({
  icon,
  label,
  accent = 'purple',
  selected,
  layoutId,
  onTap,
}: WordCardProps) {
  if (selected && layoutId) {
    return (
      <div
        className="min-h-[5.5rem] min-w-[5.5rem] rounded-3xl border-4 border-dashed border-gray-300/60 bg-gray-100/40"
        aria-hidden
      />
    )
  }

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={onTap}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      animate={selected ? { scale: 1.05 } : { scale: 1 }}
      className={`
        flex min-h-[5.5rem] min-w-[5.5rem] flex-col items-center justify-center gap-1
        rounded-3xl border-4 p-3 shadow-lg transition-colors
        ${accentStyles[accent]}
        ${selected ? 'ring-4 ring-yellow-300' : ''}
      `}
      aria-label={label}
    >
      <span className="text-4xl leading-none sm:text-5xl" role="img" aria-hidden>
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </motion.button>
  )
}
