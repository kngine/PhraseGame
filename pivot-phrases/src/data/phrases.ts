export type PivotPhrase = {
  id: string
  text: string
  icon: string
}

export type TargetCategory = 'animals' | 'food' | 'clothing'

export type TargetWord = {
  id: string
  text: string
  icon: string
  category: TargetCategory
}

export const PIVOT_PHRASES: PivotPhrase[] = [
  { id: 'want', text: 'I want', icon: '🤲' },
  { id: 'see', text: 'I see a', icon: '👀' },
  { id: 'where', text: 'Where is the', icon: '🔍' },
  { id: 'look', text: 'Look at the', icon: '☝️' },
  { id: 'put', text: 'Put on', icon: '👕' },
]

export const TARGET_WORDS: TargetWord[] = [
  { id: 'dog', text: 'dog', icon: '🐶', category: 'animals' },
  { id: 'cat', text: 'cat', icon: '🐱', category: 'animals' },
  { id: 'bird', text: 'bird', icon: '🐦', category: 'animals' },
  { id: 'fish', text: 'fish', icon: '🐟', category: 'animals' },
  { id: 'apple', text: 'apple', icon: '🍎', category: 'food' },
  { id: 'cookie', text: 'cookie', icon: '🍪', category: 'food' },
  { id: 'milk', text: 'milk', icon: '🥛', category: 'food' },
  { id: 'banana', text: 'banana', icon: '🍌', category: 'food' },
  { id: 'shoes', text: 'shoes', icon: '👟', category: 'clothing' },
  { id: 'hat', text: 'hat', icon: '🧢', category: 'clothing' },
  { id: 'coat', text: 'coat', icon: '🧥', category: 'clothing' },
]

export const CATEGORY_META: Record<
  TargetCategory,
  { label: string; icon: string; color: string }
> = {
  animals: { label: 'Animals', icon: '🐾', color: 'bg-amber-400' },
  food: { label: 'Food', icon: '🍽️', color: 'bg-rose-400' },
  clothing: { label: 'Clothes', icon: '👕', color: 'bg-sky-400' },
}

export function buildSentence(pivot: PivotPhrase, target: TargetWord): string {
  return `${pivot.text} ${target.text}`
}
