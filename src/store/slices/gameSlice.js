//только состояние текущей игры
import { createSlice } from '@reduxjs/toolkit';

const config = {
  playerHealth: 100,
  enemyHealth: 100,
  cardCount: 5,
  minCardValue: 1,
  maxCardValue: 10
};

// Генерируем уникальные ID для карт
const generateCards = (count, isPlayer = true) => {
  const cards = [];
  const baseId = isPlayer ? 0 : 100;
  for (let i = 0; i < count; i++) {
    cards.push({
      id: baseId + i,
      value: Math.floor(Math.random() * (config.maxCardValue - config.minCardValue + 1)) + config.minCardValue,
      health: 10,
      maxHealth: 10,
      superAttack: 0, // Добавляем шкалу супер удара
      hasUsedSuperAttack: false, // Отслеживаем использовался ли супер удар
      isPlayer: isPlayer
    });
  }
  return cards;
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
  defendingCardId: null,
  battleResult: null,
  isBattleActive: true,
  battleMode: 'manual',
  showBattleResultModal: false,
  // ✅ Конфиг игры
  config: config,
  
  // ✅ ID для синхронизации с сервером
 
  // ✅ История игры
  turns: [],
  superAttackUsage: [],
  serverBattleId: null, // ★★★ ДОБАВЛЕНО: ID битвы на сервере ★★★
  turns: [], // ★★★ ДОБАВЛЕНО: история ходов ★★★
  superAttackUsage: [] // ★★★ ДОБАВЛЕНО: использование супер атак ★★★
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state) => {
      state.playerCards = generateCards(state.config.cardCount, true);
      state.enemyCards = generateCards(state.config.cardCount, false);
      state.selectedPlayerCard = null;
      state.selectedEnemyCard = null;
      state.playerHealth = state.config.playerHealth;
      state.enemyHealth = state.config.enemyHealth;
      state.isPlayerTurn = true;
      state.attackingCardId = null;
      state.defendingCardId = null;
      state.battleMode = 'manual';
      state.showBattleResultModal = false;
      state.battleResult = null;
      state.isBattleActive = true;
      state.serverBattleId = null; // ★★★ ДОБАВЛЕНО: сброс ID битвы ★★★
      state.turns = []; // ★★★ ДОБАВЛЕНО: сброс истории ходов ★★★
      state.superAttackUsage = []; // ★★★ ДОБАВЛЕНО: сброс использования супер атак ★★★
    },

    resetGame: (state) => {
      state.playerCards = generateCards(state.config.cardCount, true);
      state.enemyCards = generateCards(state.config.cardCount, false);
      state.selectedPlayerCard = null;
      state.selectedEnemyCard = null;
      state.playerHealth = state.config.playerHealth;
      state.enemyHealth = state.config.enemyHealth;
      state.isPlayerTurn = true;
      state.attackingCardId = null;
      state.defendingCardId = null;
      state.battleMode = 'manual';
      state.showBattleResultModal = false;
      state.battleResult = null;
      state.isBattleActive = true;
      state.serverBattleId = null; // ★★★ ДОБАВЛЕНО: сброс ID битвы ★★★
      state.turns = []; // ★★★ ДОБАВЛЕНО: сброс истории ходов ★★★
      state.superAttackUsage = []; // ★★★ ДОБАВЛЕНО: сброс использования супер атак ★★★
    },

    // ★★★ ДОБАВЛЕНО: Установка ID битвы с сервера ★★★
    setServerBattleId: (state, action) => {
      state.serverBattleId = action.payload;
    },

    // ★★★ ДОБАВЛЕНО: Добавление хода в историю ★★★
    addTurn: (state, action) => {
      state.turns.push(action.payload);
    },

    // ★★★ ДОБАВЛЕНО: Запись использования супер атаки ★★★
    recordSuperAttack: (state, action) => {
      state.superAttackUsage.push(action.payload);
    },

    selectPlayerCard: (state, action) => {
      if (action.payload.health > 0) {
        state.selectedPlayerCard = action.payload;
      }
    },

    selectEnemyCard: (state, action) => {
      if (action.payload.health > 0 && state.selectedPlayerCard) {
        state.selectedEnemyCard = action.payload;
      }
    },

    updateCardHealth: (state, action) => {
      const { cardId, newHealth, isPlayerCard } = action.payload;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      const card = state[cardArray].find(card => card.id === cardId);
      if (card) {
        card.health = Math.max(0, newHealth);
      }
    },

    removeCard: (state, action) => {
      const { cardId, isPlayerCard } = action.payload;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      state[cardArray] = state[cardArray].filter(card => card.id !== cardId);
    },

    setBattleResult: (state, action) => {
      state.battleResult = action.payload;
      state.isBattleActive = false;
    },

    updateHealth: (state, action) => {
      const { playerHealth, enemyHealth } = action.payload;
      if (playerHealth !== undefined) state.playerHealth = Math.max(0, playerHealth);
      if (enemyHealth !== undefined) state.enemyHealth = Math.max(0, enemyHealth);
    },

    setTurn: (state, action) => {
      state.isPlayerTurn = action.payload;
    },

    resetSelection: (state) => {
      state.selectedPlayerCard = null;
      state.selectedEnemyCard = null;
    },

    setAnimation: (state, action) => {
      state.attackingCardId = action.payload.attackingCardId;
      state.defendingCardId = action.payload.defendingCardId;
    },

    clearAnimation: (state) => {
      state.attackingCardId = null;
      state.defendingCardId = null;
    },

    setBattleMode: (state, action) => {
      state.battleMode = action.payload;
    },

    showBattleResultModal: (state, action) => {
      console.log('showBattleResultModal вызван с результатом:', action.payload);
      state.showBattleResultModal = true;
      state.battleResult = action.payload;
    },

    hideBattleResultModal: (state) => {
      state.showBattleResultModal = false;
      state.battleResult = null;
      state.playerCards = [];
      state.enemyCards = [];
      state.selectedPlayerCard = null;
      state.selectedEnemyCard = null;
      state.isPlayerTurn = true;
      state.attackingCardId = null;
      state.defendingCardId = null;
      state.serverBattleId = null; // ★★★ ДОБАВЛЕНО: сброс ID битвы ★★★
      state.turns = []; // ★★★ ДОБАВЛЕНО: сброс истории ходов ★★★
      state.superAttackUsage = []; // ★★★ ДОБАВЛЕНО: сброс использования супер атак ★★★
    },

    // ★★★ НОВЫЕ ЭКШЕНЫ ДЛЯ СУПЕР УДАРА ★★★
    updateSuperAttack: (state, action) => {
      const { cardId, newSuperAttack, isPlayerCard } = action.payload;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      const card = state[cardArray].find(card => card.id === cardId);
      if (card) {
        card.superAttack = Math.min(100, Math.max(0, newSuperAttack));
      }
    },

    useSuperAttack: (state, action) => {
      const { cardId, isPlayerCard } = action.payload;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      const card = state[cardArray].find(card => card.id === cardId);
      if (card) {
        card.superAttack = 0;
        card.hasUsedSuperAttack = true;
        
        // ★★★ ДОБАВЛЕНО: Записываем использование супер атаки ★★★
        state.superAttackUsage.push({
          cardId: cardId,
          isPlayerCard: isPlayerCard,
          timestamp: new Date().toISOString()
        });
      }
    },

    resetSuperAttack: (state, action) => {
      const { cardId, isPlayerCard } = action.payload;
      const cardArray = isPlayerCard ? 'playerCards' : 'enemyCards';
      const card = state[cardArray].find(card => card.id === cardId);
      if (card) {
        card.superAttack = 0;
        card.hasUsedSuperAttack = false;
      }
    }
  },
});

export const {
  initGame,
  resetGame,
  setServerBattleId, // ★★★ ДОБАВЛЕНО: экспорт нового экшена ★★★
  addTurn, // ★★★ ДОБАВЛЕНО: экспорт нового экшена ★★★
  recordSuperAttack, // ★★★ ДОБАВЛЕНО: экспорт нового экшена ★★★
  selectPlayerCard,
  selectEnemyCard,
  updateCardHealth,
  removeCard,
  setBattleResult,
  updateHealth,
  setTurn,
  resetSelection,
  setAnimation,
  clearAnimation,
  setBattleMode,
  showBattleResultModal,
  hideBattleResultModal,
  updateSuperAttack,
  useSuperAttack,
  resetSuperAttack
} = gameSlice.actions;

export default gameSlice.reducer;
