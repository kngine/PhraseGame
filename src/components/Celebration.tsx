import { motion } from 'framer-motion'
import { useMemo } from 'react'

type CelebrationProps = {
  active: boolean
}

const CONFETTI_COLORS = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#a78bfa', '#fb7185']

export function Celebration({ active }: CelebrationProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 100,
        delay: Math.random() * 0.3,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + Math.random() * 10,
        isStar: i % 3 === 0,
      })),
    [],
  )

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/3"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: `${p.x}vw`,
            y: ['0vh', `${30 + Math.random() * 50}vh`],
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.8],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
        >
          {p.isStar ? (
            <span className="text-3xl">⭐</span>
          ) : (
            <div
              className="rounded-sm"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
            />
          )}
        </motion.div>
      ))}

      {[0, 1, 2].map((i) => (
        <motion.span
          key={`bounce-${i}`}
          className="absolute text-6xl"
          style={{ left: `${25 + i * 25}%`, top: '18%' }}
          initial={{ y: 0, scale: 0 }}
          animate={{
            y: [0, -40, 0, -20, 0],
            scale: [0, 1.4, 1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 1.2, delay: i * 0.15 }}
        >
          🎉
        </motion.span>
      ))}
    </div>
  )
}
