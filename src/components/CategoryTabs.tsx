import { motion } from 'framer-motion'
import { CATEGORY_META, type TargetCategory } from '../data/phrases'

type CategoryTabsProps = {
  active: TargetCategory
  onChange: (category: TargetCategory) => void
}

const categories: TargetCategory[] = ['animals', 'food', 'clothing']

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center gap-2 px-2 sm:gap-3">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat]
        const isActive = active === cat
        return (
          <motion.button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.9 }}
            className={`
              flex min-h-[3.25rem] min-w-[5.5rem] flex-col items-center justify-center
              rounded-2xl border-4 px-3 py-2 text-white shadow-md
              ${meta.color}
              ${isActive ? 'border-yellow-300 ring-4 ring-yellow-200' : 'border-white/60'}
            `}
            aria-pressed={isActive}
            aria-label={meta.label}
          >
            <span className="text-2xl leading-none" aria-hidden>
              {meta.icon}
            </span>
            <span className="sr-only">{meta.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
