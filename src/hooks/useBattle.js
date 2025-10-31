import { useCallback } from 'react';
import { useGameState } from './useGameState';
import { useSound } from './useSound';

// Выносим calculateDamage в этот файл
const calculateDamage = (attackerValue) => {
  return Math.max(1, attackerValue - Math.floor(Math.random() * 3));
};

export const useBattle = () => {
  const { state, dispatch } = useGameState();
  const { playSound } = useSound();

  const enemyTurn = useCallback(() => {
    console.log('enemyTurn started');
    
    // Фильтруем только живые карты противника
    const aliveEnemyCards = state.enemyCards.filter(card => card.health > 0);
    // Фильтруем только живые карты игрока
    const alivePlayerCards = state.playerCards.filter(card => card.health > 0);

    if (aliveEnemyCards.length === 0 || alivePlayerCards.length === 0) {
      console.log('No alive cards for enemy turn');
      dispatch({ type: 'SET_TURN', isPlayerTurn: true });
      return;
    }

    // Выбираем случайные карты для атаки и защиты
    const attackingCard = aliveEnemyCards[Math.floor(Math.random() * aliveEnemyCards.length)];
    const defendingCard = alivePlayerCards[Math.floor(Math.random() * alivePlayerCards.length)];

    console.log('Enemy attack:', {
      attackingCard: attackingCard.id,
      defendingCard: defendingCard.id,
      attackingCardValue: attackingCard.value,
      defendingCardValue: defendingCard.value
    });

    // Устанавливаем анимацию - противник атакует, игрок защищается
    dispatch({ 
      type: 'SET_ANIMATION', 
      attackingCardId: attackingCard.id, 
      defendingCardId: defendingCard.id 
    });

    const damage = calculateDamage(attackingCard.value);
    // playSound('attack');

    const newHealth = defendingCard.health - damage;

    setTimeout(() => {
      // Обновляем здоровье карты игрока
      dispatch({
        type: 'UPDATE_CARD_HEALTH',
        cardId: defendingCard.id,
        newHealth,
        isPlayerCard: true
      });

      if (newHealth <= 0) {
        setTimeout(() => {
          // Удаляем карту игрока
          dispatch({
            type: 'REMOVE_CARD',
            cardId: defendingCard.id,
            isPlayerCard: true
          });

          // Прямой урон, если у игрока не осталось живых карт
          const remainingPlayerCards = state.playerCards.filter(card => card.health > 0 && card.id !== defendingCard.id);
          if (remainingPlayerCards.length === 0) {
            const directDamage = 10;
            dispatch({
              type: 'UPDATE_HEALTH',
              playerHealth: Math.max(0, state.playerHealth - directDamage)
            });
          }

          // Сбрасываем анимацию
          dispatch({ type: 'CLEAR_ANIMATION' });
          dispatch({ type: 'SET_TURN', isPlayerTurn: true });
        }, 1000);
      } else {
        // Сбрасываем анимацию
        dispatch({ type: 'CLEAR_ANIMATION' });
        dispatch({ type: 'SET_TURN', isPlayerTurn: true });
      }
    }, 1000);
  }, [state, dispatch]);

  const performAttack = useCallback(() => {
    console.log('performAttack started:', {
      playerCard: state.selectedPlayerCard,
      enemyCard: state.selectedEnemyCard,
      attackingCardId: state.attackingCardId,
      defendingCardId: state.defendingCardId
    });

    // Фильтруем только живые карты
    const alivePlayerCards = state.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = state.enemyCards.filter(card => card.health > 0);

    if (!state.isPlayerTurn || 
        !state.selectedPlayerCard || 
        !state.selectedEnemyCard ||
        alivePlayerCards.length === 0 ||
        aliveEnemyCards.length === 0) {
      console.log('Attack conditions not met');
      return;
    }

    const playerCard = state.selectedPlayerCard;
    const enemyCard = state.selectedEnemyCard;

    // Проверяем, что выбранные карты еще живы
    if (playerCard.health <= 0 || enemyCard.health <= 0) {
      dispatch({ type: 'RESET_SELECTION' });
      return;
    }

    // Устанавливаем анимацию - игрок атакует, противник защищается
    dispatch({ 
      type: 'SET_ANIMATION', 
      attackingCardId: playerCard.id, 
      defendingCardId: enemyCard.id 
    });

    const damage = calculateDamage(playerCard.value);
    // playSound('attack');

    const newHealth = enemyCard.health - damage;
    
    setTimeout(() => {
      // Обновляем здоровье карты противника
      dispatch({
        type: 'UPDATE_CARD_HEALTH',
        cardId: enemyCard.id,
        newHealth,
        isPlayerCard: false
      });

      if (newHealth <= 0) {
        setTimeout(() => {
          // Удаляем карту противника
          dispatch({
            type: 'REMOVE_CARD',
            cardId: enemyCard.id,
            isPlayerCard: false
          });

          // Прямой урон, если у противника не осталось живых карт
          const remainingEnemyCards = state.enemyCards.filter(card => card.health > 0 && card.id !== enemyCard.id);
          const directDamage = 10;
          if (remainingEnemyCards.length === 0) {
            dispatch({
              type: 'UPDATE_HEALTH',
              enemyHealth: Math.max(0, state.enemyHealth - directDamage)
            });
          }

          // Сбрасываем анимацию и выделение
          dispatch({ type: 'CLEAR_ANIMATION' });
          dispatch({ type: 'RESET_SELECTION' });
          
          // Передаем ход противнику только если игра не закончилась
          if (state.enemyHealth > directDamage) {
            dispatch({ type: 'SET_TURN', isPlayerTurn: false });
            setTimeout(enemyTurn, 1000);
          }
        }, 1000);
      } else {
        // Сбрасываем анимацию и выделение
        dispatch({ type: 'CLEAR_ANIMATION' });
        dispatch({ type: 'RESET_SELECTION' });
        dispatch({ type: 'SET_TURN', isPlayerTurn: false });
        setTimeout(enemyTurn, 1000);
      }
    }, 1000);
  }, [state, dispatch, enemyTurn]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  return {
    performAttack,
    enemyTurn,
    resetGame
  };
};
