export type PivotPhrase = {
  id: string
  text: string
  icon: string
}

export type TargetWord = {
  id: string
  text: string
  icon: string
}

export const PIVOT_PHRASES: PivotPhrase[] = [
  { id: 'want', text: 'I want', icon: '🤲' },
  { id: 'need', text: 'I need', icon: '🙏' },
  { id: 'like', text: 'I like', icon: '💜' },
  { id: 'have', text: 'I have', icon: '🙌' },
  { id: 'see', text: 'I see a', icon: '👀' },
  { id: 'where', text: 'Where is the', icon: '🔍' },
  { id: 'look', text: 'Look at the', icon: '☝️' },
  { id: 'put', text: 'Put on', icon: '👕' },
  { id: 'open', text: 'Open the', icon: '📂' },
  { id: 'help', text: 'Help me with', icon: '🆘' },
  { id: 'eat', text: 'Eat the', icon: '😋' },
  { id: 'drink', text: 'Drink the', icon: '🥤' },
  { id: 'more', text: 'More', icon: '➕' },
  { id: 'all-done', text: 'All done with', icon: '✅' },
]

export const TARGET_WORDS: TargetWord[] = [
  { id: 'dog', text: 'dog', icon: '🐶' },
  { id: 'cat', text: 'cat', icon: '🐱' },
  { id: 'bird', text: 'bird', icon: '🐦' },
  { id: 'fish', text: 'fish', icon: '🐟' },
  { id: 'cow', text: 'cow', icon: '🐮' },
  { id: 'horse', text: 'horse', icon: '🐴' },
  { id: 'duck', text: 'duck', icon: '🦆' },
  { id: 'pig', text: 'pig', icon: '🐷' },
  { id: 'rabbit', text: 'rabbit', icon: '🐰' },
  { id: 'apple', text: 'apple', icon: '🍎' },
  { id: 'banana', text: 'banana', icon: '🍌' },
  { id: 'cookie', text: 'cookie', icon: '🍪' },
  { id: 'milk', text: 'milk', icon: '🥛' },
  { id: 'water', text: 'water', icon: '💧' },
  { id: 'juice', text: 'juice', icon: '🧃' },
  { id: 'bread', text: 'bread', icon: '🍞' },
  { id: 'cheese', text: 'cheese', icon: '🧀' },
  { id: 'pizza', text: 'pizza', icon: '🍕' },
  { id: 'egg', text: 'egg', icon: '🥚' },
  { id: 'shoes', text: 'shoes', icon: '👟' },
  { id: 'hat', text: 'hat', icon: '🧢' },
  { id: 'coat', text: 'coat', icon: '🧥' },
  { id: 'ball', text: 'ball', icon: '⚽' },
  { id: 'book', text: 'book', icon: '📕' },
  { id: 'cup', text: 'cup', icon: '🥤' },
  { id: 'car', text: 'car', icon: '🚗' },
  { id: 'bed', text: 'bed', icon: '🛏️' },
  { id: 'potty', text: 'potty', icon: '🚽' },
  { id: 'pee', text: 'pee', icon: '🚽' },
  { id: 'poop', text: 'poop', icon: '💩' },
]

export function buildSentence(pivot: PivotPhrase, target: TargetWord): string {
  return `${pivot.text} ${target.text}`
}
