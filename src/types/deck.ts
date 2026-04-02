import type { DeckCard } from './card.js'
import type { DeckWithCard } from './game.js'

export interface Deck {
  id: number
  name: string
  userId: number
  cards: (DeckCard | DeckWithCard)[]
}

export interface DeckPayload {
  name: string
  cards: number[] // tableau de 10 cardId
}
