import React, { createContext, useContext, useReducer, useEffect } from 'react';

const config = {
  playerHealth: 100,
  enemyHealth: 100,
  cardCount: 5,
  minCardValue: 1,
  maxCardValue: 10
};

const GameContext = createContext();

// Генерируем уникальные ID для карт
const generateCards = (count, isPlayer = true) => {
  const cards = [];
  const baseId = isPlayer ? 0 : 100; // Игрок: 0-4, Противник: 100-104
  for (let i = 0; i < count; i++) {
    cards.push({
      id: baseId + i,
      value: Math.floor(Math.random() * (config.maxCardValue - config.minCardValue + 1)) + config.minCardValue,
      health: 10,
      maxHealth: 10,
      isPlayer: isPlayer // Добавляем флаг для идентификации
    });
  }
  return cards;
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        playerCards: generateCards(config.cardCount, true),
        enemyCards: generateCards(config.cardCount, false),
        selectedPlayerCard: null,
        selectedEnemyCard: null,
        playerHealth: config.playerHealth,
        enemyHealth: config.enemyHealth,
        isPlayerTurn: true,
        attackingCardId: null,
        defendingCardId: null
      };

    case 'RESET_GAME':
      return {
        playerCards: generateCards(config.cardCount, true),
        enemyCards: generateCards(config.cardCount, false),
        selectedPlayerCard: null,
        selectedEnemyCard: null,
        playerHealth: config.playerHealth,
        enemyHealth: config.enemyHealth,
        isPlayerTurn: true,
        attackingCardId: null,
        defendingCardId: null
      };
    
    case 'SELECT_PLAYER_CARD':
      // Разрешаем выбор только живых карт
      if (action.card.health > 0) {
        return { ...state, selectedPlayerCard: action.card };
      }
      return state;
    
    case 'SELECT_ENEMY_CARD':
      // Разрешаем выбор только живых карт
      if (action.card.health > 0 && state.selectedPlayerCard) {
        return { ...state, selectedEnemyCard: action.card };
      }
      return state;
    
    case 'UPDATE_CARD_HEALTH':
      const { cardId, newHealth, isPlayerCard } = action;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      return {
        ...state,
        [cardArray]: state[cardArray].map(card =>
          card.id === cardId ? { ...card, health: Math.max(0, newHealth) } : card
        )
      };
    
    case 'REMOVE_CARD':
      const removeFrom = action.isPlayerCard ? 'playerCards' : 'enemyCards';
      return {
        ...state,
        [removeFrom]: state[removeFrom].filter(card => card.id !== action.cardId)
      };
    
    case 'UPDATE_HEALTH':
      return {
        ...state,
        playerHealth: Math.max(0, action.playerHealth ?? state.playerHealth),
        enemyHealth: Math.max(0, action.enemyHealth ?? state.enemyHealth)
      };
    
    case 'SET_TURN':
      return { ...state, isPlayerTurn: action.isPlayerTurn };
    
    case 'RESET_SELECTION':
      return { ...state, selectedPlayerCard: null, selectedEnemyCard: null };
    
    case 'SET_ANIMATION':
      return {
        ...state,
        attackingCardId: action.attackingCardId,
        defendingCardId: action.defendingCardId
      };
    
    case 'CLEAR_ANIMATION':
      return {
        ...state,
        attackingCardId: null,
        defendingCardId: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  playerCards: [],
  enemyCards: [],
  selectedPlayerCard: null,
  selectedEnemyCard: null,
  playerHealth: config.playerHealth,
  enemyHealth: config.enemyHealth,
  isPlayerTurn: true,
  attackingCardId: null,
  defendingCardId: null
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Инициализация игры при монтировании
  useEffect(() => {
    dispatch({ type: 'INIT_GAME' });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, config }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};
