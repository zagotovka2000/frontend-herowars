import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectPlayerCard,
  selectEnemyCard,
  updateCardHealth,
  removeCard,
  setAnimation,
  clearAnimation,
  setTurn,
  resetSelection,
  showBattleResultModal,
  hideBattleResultModal
} from '../store/slices/gameSlice';

const calculateDamage = (attackerValue) => {
  return Math.max(1, attackerValue - Math.floor(Math.random() * 3));
};

export const useBattle = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);

  // ★★★ ФУНКЦИЯ ДЛЯ ПРОВЕРКИ ЗАВЕРШЕНИЯ БОЯ ПО КАРТАМ ★★★
  const checkBattleEndByCards = useCallback(() => {
    // Используем актуальное состояние из Redux
    const currentState = gameState;
    
    if (currentState.showBattleResultModal) {
      return true;
    }
    
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
    
    if (alivePlayerCards.length === 0) {
      console.log('Бой завершен: поражение - нет живых карт у игрока');
      dispatch(showBattleResultModal('defeat'));
      return true;
    }
    else if (aliveEnemyCards.length === 0) {
      console.log('Бой завершен: победа - нет живых карт у противника');
      dispatch(showBattleResultModal('victory'));
      return true;
    }
    return false;
  }, [gameState, dispatch]); // Добавляем gameState в зависимости

  // ★★★ ХОД ПРОТИВНИКА ★★★
  const enemyTurn = useCallback(() => {
    console.log('enemyTurn started');
    
    // Сначала проверяем, не закончился ли бой по картам
    if (checkBattleEndByCards()) {
      return;
    }
    
    const aliveEnemyCards = gameState.enemyCards.filter(card => card.health > 0);
    const alivePlayerCards = gameState.playerCards.filter(card => card.health > 0);

    if (aliveEnemyCards.length === 0 || alivePlayerCards.length === 0) {
      console.log('No alive cards for enemy turn');
      dispatch(setTurn(true));
      return;
    }

    const attackingCard = aliveEnemyCards[Math.floor(Math.random() * aliveEnemyCards.length)];
    const defendingCard = alivePlayerCards[Math.floor(Math.random() * alivePlayerCards.length)];

    console.log('Enemy attack:', {
      attackingCard: attackingCard.id,
      defendingCard: defendingCard.id,
      attackingCardValue: attackingCard.value,
      defendingCardValue: defendingCard.value
    });

    dispatch(setAnimation({
      attackingCardId: attackingCard.id,
      defendingCardId: defendingCard.id
    }));

    const damage = calculateDamage(attackingCard.value);
    const newHealth = defendingCard.health - damage;

    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: defendingCard.id,
        newHealth,
        isPlayerCard: true
      }));

      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: defendingCard.id,
            isPlayerCard: true
          }));

          // ★★★ ПРОВЕРЯЕМ ЗАВЕРШЕНИЕ БОЯ ПО КАРТАМ ★★★
          setTimeout(() => {
            if (!checkBattleEndByCards()) {
              dispatch(clearAnimation());
              dispatch(setTurn(true));
            }
          }, 100);
        }, 1000);
      } else {
        dispatch(clearAnimation());
        dispatch(setTurn(true));
      }
    }, 1000);
  }, [gameState, dispatch, checkBattleEndByCards]);

  // ★★★ РУЧНАЯ АТАКА ИГРОКА ★★★
  const performAttack = useCallback(() => {
    if (gameState.battleMode === 'auto') {
      console.log('В автоматическом режиме атака не требуется');
      return;
    }

    console.log('performAttack started:', {
      playerCard: gameState.selectedPlayerCard,
      enemyCard: gameState.selectedEnemyCard
    });

    // ★★★ ПРОВЕРЯЕМ, НЕ ЗАВЕРШИЛСЯ ЛИ УЖЕ БОЙ ★★★
    const alivePlayerCards = gameState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = gameState.enemyCards.filter(card => card.health > 0);
    
    if (alivePlayerCards.length === 0 || aliveEnemyCards.length === 0) {
      console.log('Бой уже завершен, атака невозможна');
      return;
    }

    if (!gameState.isPlayerTurn || 
        !gameState.selectedPlayerCard || 
        !gameState.selectedEnemyCard) {
      console.log('Attack conditions not met');
      return;
    }

    const playerCard = gameState.selectedPlayerCard;
    const enemyCard = gameState.selectedEnemyCard;

    if (playerCard.health <= 0 || enemyCard.health <= 0) {
      dispatch(resetSelection());
      return;
    }

    dispatch(setAnimation({
      attackingCardId: playerCard.id,
      defendingCardId: enemyCard.id
    }));

    const damage = calculateDamage(playerCard.value);
    const newHealth = enemyCard.health - damage;
    
    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: enemyCard.id,
        newHealth,
        isPlayerCard: false
      }));

      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: enemyCard.id,
            isPlayerCard: false
          }));

          // ★★★ ПРОВЕРЯЕМ ЗАВЕРШЕНИЕ БОЯ ПО КАРТАМ ★★★
          setTimeout(() => {
            if (!checkBattleEndByCards()) {
              dispatch(clearAnimation());
              dispatch(resetSelection());
              dispatch(setTurn(false));
              setTimeout(enemyTurn, 1000);
            }
          }, 100);
        }, 1000);
      } else {
        dispatch(clearAnimation());
        dispatch(resetSelection());
        dispatch(setTurn(false));
        setTimeout(enemyTurn, 1000);
      }
    }, 1000);
  }, [gameState, dispatch, enemyTurn, checkBattleEndByCards]);

  // ★★★ АВТОМАТИЧЕСКАЯ АТАКА ИГРОКА ★★★
  const autoPlayerAttack = useCallback(() => {
    console.log('Автоматическая атака игрока');
    
    // ★★★ ПРОВЕРЯЕМ, НЕ ЗАВЕРШИЛСЯ ЛИ УЖЕ БОЙ ★★★
    const alivePlayerCards = gameState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = gameState.enemyCards.filter(card => card.health > 0);
    
    if (alivePlayerCards.length === 0 || aliveEnemyCards.length === 0) {
      console.log('Бой уже завершен, автоматическая атака невозможна');
      // ★★★ ДОБАВЛЯЕМ ПРОВЕРКУ ЗАВЕРШЕНИЯ БОЯ ★★★
      checkBattleEndByCards();
      return;
    }
    
    const randomPlayerCard = alivePlayerCards[Math.floor(Math.random() * alivePlayerCards.length)];
    const randomEnemyCard = aliveEnemyCards[Math.floor(Math.random() * aliveEnemyCards.length)];
    
    console.log('Авто-атака:', {
      playerCard: randomPlayerCard.id,
      enemyCard: randomEnemyCard.id
    });
    
    dispatch(selectPlayerCard(randomPlayerCard));
    dispatch(selectEnemyCard(randomEnemyCard));
    
    dispatch(setAnimation({
      attackingCardId: randomPlayerCard.id,
      defendingCardId: randomEnemyCard.id
    }));
    
    const damage = calculateDamage(randomPlayerCard.value);
    const newHealth = randomEnemyCard.health - damage;
    
    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: randomEnemyCard.id,
        newHealth,
        isPlayerCard: false
      }));
      
      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: randomEnemyCard.id,
            isPlayerCard: false
          }));
          
          // ★★★ ПРОВЕРЯЕМ ЗАВЕРШЕНИЕ БОЯ ПО КАРТАМ ★★★
          setTimeout(() => {
            if (!checkBattleEndByCards()) {
              dispatch(clearAnimation());
              dispatch(resetSelection());
              dispatch(setTurn(false));
              setTimeout(enemyTurn, 1000);
            }
          }, 100);
        }, 1000);
      } else {
        dispatch(clearAnimation());
        dispatch(resetSelection());
        dispatch(setTurn(false));
        setTimeout(enemyTurn, 1000);
      }
    }, 1000);
  }, [gameState, dispatch, enemyTurn, checkBattleEndByCards]);
  
  // ★★★ useEffect ДЛЯ АВТОМАТИЧЕСКОГО РЕЖИМА ★★★
  useEffect(() => {
    if (gameState.battleMode === 'auto' && 
        gameState.isPlayerTurn && 
        gameState.playerHealth > 0 && 
        gameState.enemyHealth > 0) {
      
      const autoAttackTimer = setTimeout(() => {
        autoPlayerAttack();
      }, 1500);
      
      return () => clearTimeout(autoAttackTimer);
    }
  }, [gameState.battleMode, gameState.isPlayerTurn, gameState.playerHealth, gameState.enemyHealth, autoPlayerAttack]);

  const closeBattleResultModal = useCallback(() => {
    dispatch(hideBattleResultModal());
  }, [dispatch]);

  return {
    performAttack,
    enemyTurn,
    autoPlayerAttack,
    closeBattleResultModal
  };
};
