import type { Card } from './card.js'

export interface DeckWithCard {
  id: number
  cardId: number
  deckId: number
  card: Card
}

export interface LobbyRoom {
  roomId: number
  player1Username: string
  createdAt: string
}

export type PlayerRole = 'host' | 'guest' | null

export interface ActiveCardState {
  card: Card
  currentHp: number
}

export interface GameBoardState {
  userId: number
  username: string
  handSize: number
  hand: Card[]
  activeCard: ActiveCardState | null
  deckSize: number
  score: number
}

export type GameStatus = 'waiting' | 'started' | 'ended'

export interface GameStateView {
  roomId: number
  player: GameBoardState
  opponent: GameBoardState
  currentPlayerSocketId: string
  status: GameStatus
  winner: {
    userId: number
    username: string
  } | null
  createdAt: string
}

export interface GameStartedPayload {
  roomId: number
  players: {
    player1: {
      userId: number
      username: string
    }
    player2: {
      userId: number
      username: string
    }
  }
  currentPlayerSocketId: string
}

export interface SocketResponse<T = null> {
  success: boolean
  message?: string
  data?: T
}

export interface GameResult {
  winner: {
    userId: number
    username: string
  } | null
}
