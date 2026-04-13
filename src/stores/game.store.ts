import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router, { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import type {
  GameResult,
  GameStartedPayload,
  GameStateView,
  LobbyRoom,
  PlayerRole,
  SocketResponse,
} from '@/types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string

export const useGameStore = defineStore('game', () => {
  const authStore = useAuthStore()

  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const rooms = ref<LobbyRoom[]>([])
  const currentRoomId = ref<number | null>(null)
  const gameState = ref<GameStateView | null>(null)
  const playerRole = ref<PlayerRole>(null)
  const gameResult = ref<GameResult | null>(null)
  const errorMessage = ref('')
  const realtimeMessage = ref('')

  const isMyTurn = computed(() => {
    if (!socket.value || !gameState.value) {
      return false
    }

    return gameState.value.currentPlayerSocketId === socket.value.id
  })

  const myBoard = computed(() => gameState.value?.player ?? null)
  const opponentBoard = computed(() => gameState.value?.opponent ?? null)
  const isGameOver = computed(() => gameResult.value !== null)

  const fetchRooms = () => {
    if (!socket.value) {
      return
    }

    socket.value.emit(
      'listWaitingRooms',
      (response: SocketResponse<LobbyRoom[]>) => {
        if (!response.success) {
          errorMessage.value =
            response.message ?? 'Impossible de charger les rooms.'
          return
        }

        rooms.value = response.data ?? []
      },
    )
  }

  const ensureSocket = () => {
    if (socket.value) {
      return
    }

    socket.value = io(SOCKET_URL, {
      auth: {
        token: authStore.token,
      },
      autoConnect: true,
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      errorMessage.value = ''
      realtimeMessage.value = 'Connecte au serveur de jeu.'
      fetchRooms()
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      realtimeMessage.value = 'Connexion Socket interrompue.'
    })

    socket.value.on('connect_error', (err: Error) => {
      errorMessage.value = err.message
    })

    socket.value.on('roomsList', (payload: SocketResponse<LobbyRoom[]>) => {
      if (payload.success && payload.data) {
        rooms.value = payload.data
      }
    })

    socket.value.on('roomsListUpdated', () => {
      fetchRooms()
    })

    socket.value.on(
      'roomCreated',
      (payload: SocketResponse<{ roomId: number }>) => {
        if (payload.success && payload.data) {
          currentRoomId.value = payload.data.roomId
        }
      },
    )

    socket.value.on(
      'gameStarted',
      async (payload: SocketResponse<GameStartedPayload>) => {
        if (!payload.success || !payload.data) {
          return
        }

        currentRoomId.value = payload.data.roomId
        playerRole.value =
          authStore.user?.id === payload.data.players.player1.userId
            ? 'host'
            : 'guest'
        realtimeMessage.value = 'La partie commence.'

        if (router.currentRoute.value.path !== ROUTES.GAME) {
          await router.push(ROUTES.GAME)
        }
      },
    )

    socket.value.on(
      'gameStateUpdated',
      (payload: SocketResponse<GameStateView>) => {
        if (!payload.success || !payload.data) {
          return
        }

        gameState.value = payload.data
        realtimeMessage.value = isMyTurn.value
          ? 'A vous de jouer.'
          : "Tour de l'adversaire."
      },
    )

    socket.value.on('gameEnded', (payload: SocketResponse<GameResult>) => {
      if (!payload.success || !payload.data) {
        return
      }

      gameResult.value = payload.data
      realtimeMessage.value =
        payload.data.winner?.userId === authStore.user?.id
          ? 'Victoire.'
          : 'Defaite.'
    })

    socket.value.on(
      'opponentDisconnected',
      (payload: SocketResponse<{ message: string }>) => {
        realtimeMessage.value =
          payload.data?.message ?? "L'adversaire est deconnecte."
      },
    )

    socket.value.on('error', (payload: SocketResponse) => {
      errorMessage.value = payload.message ?? 'Une erreur Socket est survenue.'
    })
  }

  const connect = () => {
    if (!authStore.token) {
      errorMessage.value = 'Token JWT manquant.'
      return
    }

    ensureSocket()

    if (socket.value && !socket.value.connected) {
      socket.value.auth = {
        token: authStore.token,
      }
      socket.value.connect()
    }
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const createRoom = (deckId: number) => {
    if (!socket.value) {
      return
    }

    socket.value.emit(
      'createRoom',
      { deckId },
      (response: SocketResponse<{ roomId: number }>) => {
        if (!response.success || !response.data) {
          errorMessage.value =
            response.message ?? 'Impossible de creer la room.'
          return
        }

        currentRoomId.value = response.data.roomId
        realtimeMessage.value = `Room #${response.data.roomId} creee. En attente d'un joueur.`
        fetchRooms()
      },
    )
  }

  const joinRoom = (roomId: number, deckId: number) => {
    if (!socket.value) {
      return
    }

    socket.value.emit(
      'joinRoom',
      {
        roomId,
        deckId,
        username: authStore.user?.username ?? 'Player',
      },
      (response: SocketResponse) => {
        if (!response.success) {
          errorMessage.value =
            response.message ?? 'Impossible de rejoindre la room.'
          return
        }

        currentRoomId.value = roomId
        realtimeMessage.value = 'Connexion a la room en cours...'
        fetchRooms()
      },
    )
  }

  const drawCards = () => {
    if (!socket.value || !currentRoomId.value) {
      return
    }

    socket.value.emit(
      'drawCards',
      { roomId: currentRoomId.value },
      (response: SocketResponse) => {
        if (!response.success) {
          errorMessage.value = response.message ?? 'Impossible de piocher.'
        }
      },
    )
  }

  const playCard = (cardIndex: number) => {
    if (!socket.value || !currentRoomId.value) {
      return
    }

    socket.value.emit(
      'playCard',
      { roomId: currentRoomId.value, cardIndex },
      (response: SocketResponse) => {
        if (!response.success) {
          errorMessage.value =
            response.message ?? 'Impossible de jouer cette carte.'
        }
      },
    )
  }

  const attack = () => {
    if (!socket.value || !currentRoomId.value) {
      return
    }

    socket.value.emit(
      'attack',
      { roomId: currentRoomId.value },
      (response: SocketResponse) => {
        if (!response.success) {
          errorMessage.value = response.message ?? 'Attaque impossible.'
        }
      },
    )
  }

  const endTurn = () => {
    if (!socket.value || !currentRoomId.value) {
      return
    }

    socket.value.emit(
      'endTurn',
      { roomId: currentRoomId.value },
      (response: SocketResponse) => {
        if (!response.success) {
          errorMessage.value = response.message ?? 'Fin de tour impossible.'
        }
      },
    )
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  const resetGame = async () => {
    currentRoomId.value = null
    gameState.value = null
    playerRole.value = null
    gameResult.value = null
    realtimeMessage.value = ''
    errorMessage.value = ''

    await router.push(ROUTES.HOME)
    fetchRooms()
  }

  return {
    isConnected,
    rooms,
    currentRoomId,
    gameState,
    playerRole,
    gameResult,
    errorMessage,
    realtimeMessage,
    isMyTurn,
    myBoard,
    opponentBoard,
    isGameOver,
    connect,
    disconnect,
    fetchRooms,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    clearError,
    resetGame,
  }
})
