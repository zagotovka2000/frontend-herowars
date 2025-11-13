// store/slices/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const config = {
  playerHealth: 100,
  enemyHealth: 100,
  cardCount: 5,
  minCardValue: 1,
  maxCardValue: 10
};

const generateCards = (count, isPlayer = true) => {
  const cards = [];
  const baseId = isPlayer ? 0 : 100;
  for (let i = 0; i < count; i++) {
    cards.push({
      id: baseId + i,
      value: Math.floor(Math.random() * (config.maxCardValue - config.minCardValue + 1)) + config.minCardValue,
      health: 10,
      maxHealth: 10,
      superAttack: 0,
      hasUsedSuperAttack: false,
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
   config: config,
   serverBattleId: null,
   turns: [],
   superAttackUsage: []
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Инициализация новой игры
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
      state.serverBattleId = null;
      state.turns = [];
      state.superAttackUsage = [];
    },

    // УДАЛЕНО: resetGame - дублирует initGame

    // Экшен для атаки игрока
    attack: (state, action) => {
      const { playerCardId, enemyCardId, isSuperAttack = false } = action.payload;
      
      const playerCard = state.playerCards.find(card => card.id === playerCardId);
      const enemyCard = state.enemyCards.find(card => card.id === enemyCardId);
      
      if (!playerCard || !enemyCard || playerCard.health <= 0 || enemyCard.health <= 0) {
        return;
      }
      
      state.attackingCardId = playerCardId;
      state.defendingCardId = enemyCardId;
      
      let damage = playerCard.value;
      if (isSuperAttack) {
        damage *= 2;
        playerCard.superAttack = 0;
        playerCard.hasUsedSuperAttack = true;
        
        state.superAttackUsage.push({
          cardId: playerCardId,
          isPlayerCard: true,
          timestamp: new Date().toISOString()
        });
      } else {
        playerCard.superAttack = Math.min(100, playerCard.superAttack + 25);
      }
      
      enemyCard.health = Math.max(0, enemyCard.health - damage);
      
      state.turns.push({
        type: 'player_attack',
        playerCardId,
        enemyCardId,
        damage,
        isSuperAttack,
        timestamp: new Date().toISOString()
      });
      
      if (enemyCard.health <= 0) {
        enemyCard.health = 0;
      }
      
      const aliveEnemyCards = state.enemyCards.filter(card => card.health > 0);
      const alivePlayerCards = state.playerCards.filter(card => card.health > 0);
      
      if (aliveEnemyCards.length === 0) {
        state.battleResult = 'victory';
        state.isBattleActive = false;
        state.showBattleResultModal = true;
      } else if (alivePlayerCards.length === 0) {
        state.battleResult = 'defeat';
        state.isBattleActive = false;
        state.showBattleResultModal = true;
      } else {
        state.isPlayerTurn = false;
      }
    },

    // Экшен для атаки противника (AI)
    enemyAttack: (state) => {
      if (state.isPlayerTurn || !state.isBattleActive) return;
      
      const aliveEnemyCards = state.enemyCards.filter(card => card.health > 0);
      const alivePlayerCards = state.playerCards.filter(card => card.health > 0);
      
      if (aliveEnemyCards.length === 0 || alivePlayerCards.length === 0) return;
      
      const randomEnemyCard = aliveEnemyCards[Math.floor(Math.random() * aliveEnemyCards.length)];
      const randomPlayerCard = alivePlayerCards[Math.floor(Math.random() * alivePlayerCards.length)];
      
      state.attackingCardId = randomEnemyCard.id;
      state.defendingCardId = randomPlayerCard.id;
      
      const useSuperAttack = randomEnemyCard.superAttack >= 100;
      
      let damage = randomEnemyCard.value;
      if (useSuperAttack) {
        damage *= 2;
        randomEnemyCard.superAttack = 0;
        randomEnemyCard.hasUsedSuperAttack = true;
        
        state.superAttackUsage.push({
          cardId: randomEnemyCard.id,
          isPlayerCard: false,
          timestamp: new Date().toISOString()
        });
      } else {
        randomEnemyCard.superAttack = Math.min(100, randomEnemyCard.superAttack + 25);
      }
      
      randomPlayerCard.health = Math.max(0, randomPlayerCard.health - damage);
      
      state.turns.push({
        type: 'enemy_attack',
        enemyCardId: randomEnemyCard.id,
        playerCardId: randomPlayerCard.id,
        damage,
        isSuperAttack: useSuperAttack,
        timestamp: new Date().toISOString()
      });
      
      if (randomPlayerCard.health <= 0) {
        randomPlayerCard.health = 0;
      }
      
      const aliveEnemyCardsAfter = state.enemyCards.filter(card => card.health > 0);
      const alivePlayerCardsAfter = state.playerCards.filter(card => card.health > 0);
      
      if (alivePlayerCardsAfter.length === 0) {
        state.battleResult = 'defeat';
        state.isBattleActive = false;
        state.showBattleResultModal = true;
      } else if (aliveEnemyCardsAfter.length === 0) {
        state.battleResult = 'victory';
        state.isBattleActive = false;
        state.showBattleResultModal = true;
      } else {
        state.isPlayerTurn = true;
      }
    },

    setServerBattleId: (state, action) => {
      state.serverBattleId = action.payload;
    },

    // УДАЛЕНО: addTurn - дублируется в attack и enemyAttack
    // УДАЛЕНО: recordSuperAttack - дублируется в attack и enemyAttack

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
      state.showBattleResultModal = true;
      state.battleResult = action.payload;
      state.isBattleActive = false;
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
      state.serverBattleId = null;
      state.turns = [];
      state.superAttackUsage = [];
    },

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
  attack,
  enemyAttack,
  setServerBattleId,
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
