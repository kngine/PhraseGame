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
  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={onTap}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      animate={selected ? { scale: 1.05 } : { scale: 1 }}
      className={`
        flex h-[clamp(4.15rem,12vw,6.5rem)] w-[clamp(4.15rem,12vw,6.5rem)]
        flex-shrink-0 flex-col items-center justify-center gap-1
        rounded-[1.35rem] border-[3px] p-2 shadow-lg transition-colors sm:border-4 md:rounded-3xl
        ${accentStyles[accent]}
        ${selected ? 'ring-4 ring-yellow-300 ring-offset-2' : ''}
      `}
      aria-label={label}
    >
      <span className="text-[clamp(2rem,6.8vw,3.75rem)] leading-none" role="img" aria-hidden>
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </motion.button>
  )
}
