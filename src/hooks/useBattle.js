import { useCallback, useEffect, useRef } from 'react';
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
  hideBattleResultModal,
  updateSuperAttack,
  useSuperAttack
} from '../store/slices/gameSlice';

const calculateDamage = (attackerValue, isSuperAttack = false) => {
  const baseDamage = Math.max(1, attackerValue - Math.floor(Math.random() * 3));
  return isSuperAttack ? Math.floor(baseDamage * 1.8) : baseDamage;
};

// Функция для расчета заполнения шкалы супер удара
const calculateSuperAttackGain = (damage, isAttacking = true) => {
  // Базовое заполнение зависит от урона
  const baseGain = isAttacking ? damage * 4 : damage * 3; // Увеличил множители для более быстрого заполнения
  
  // Случайный бонус
  const randomBonus = Math.random() * (isAttacking ? 20 : 15);
  
  // Бонус за большой урон
  const criticalBonus = damage > 5 ? 15 : 0;
  
  return Math.min(30, baseGain + randomBonus + criticalBonus); // Ограничиваем максимальное заполнение за один раз
};

export const useBattle = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  
  const stateRef = useRef();
  stateRef.current = gameState;

  const battleEndedRef = useRef(false);

  // ★★★ ФУНКЦИЯ ДЛЯ ПРОВЕРКИ ЗАВЕРШЕНИЯ БОЯ ★★★
  const checkBattleEndByCards = useCallback(() => {
    const currentState = stateRef.current;
    
    if (battleEndedRef.current || currentState.showBattleResultModal) {
      return true;
    }
    
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
    
    if (alivePlayerCards.length === 0) {
      console.log('Бой завершен: поражение');
      battleEndedRef.current = true;
      dispatch(showBattleResultModal('defeat'));
      return true;
    }
    else if (aliveEnemyCards.length === 0) {
      console.log('Бой завершен: победа');
      battleEndedRef.current = true;
      dispatch(showBattleResultModal('victory'));
      return true;
    }
    return false;
  }, [dispatch]);

  // ★★★ ПРОВЕРКА ВОЗМОЖНОСТИ АТАКИ ★★★
  const canAttack = useCallback(() => {
    const currentState = stateRef.current;
    
    if (battleEndedRef.current) {
      return false;
    }
    
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
    
    return alivePlayerCards.length > 0 && aliveEnemyCards.length > 0;
  }, []);

  // ★★★ ВЫБОР СЛУЧАЙНОЙ ЖИВОЙ КАРТЫ ★★★
  const getRandomAliveCard = useCallback((cards) => {
    const aliveCards = cards.filter(card => card.health > 0);
    return aliveCards.length > 0 ? aliveCards[Math.floor(Math.random() * aliveCards.length)] : null;
  }, []);

  // ★★★ ГАРАНТИЯ СУПЕР УДАРА ПЕРЕД СМЕРТЬЮ ★★★
  const ensureSuperAttackBeforeDeath = useCallback((card, isPlayerCard) => {
    // Если у карты мало здоровья (<30%) и она еще не использовала супер удар
    if (card.health <= card.maxHealth * 0.3 && !card.hasUsedSuperAttack && card.superAttack < 80) {
      // Быстро заполняем шкалу супер удара
      const boostAmount = 100 - card.superAttack;
      dispatch(updateSuperAttack({
        cardId: card.id,
        newSuperAttack: 100,
        isPlayerCard
      }));
      console.log(`Карта ${card.id} получила ускорение супер удара перед смертью!`);
    }
  }, [dispatch]);

  // ★★★ ХОД ПРОТИВНИКА ★★★
  const enemyTurn = useCallback(() => {
    console.log('enemyTurn started');
    
    if (!canAttack()) {
      console.log('Атака невозможна: нет живых карт');
      checkBattleEndByCards();
      return;
    }
    
    const currentState = stateRef.current;
    const attackingCard = getRandomAliveCard(currentState.enemyCards);
    const defendingCard = getRandomAliveCard(currentState.playerCards);

    if (!attackingCard || !defendingCard) {
      console.log('Не найдены карты для атаки');
      checkBattleEndByCards();
      return;
    }

    // Проверяем гарантию супер удара перед смертью
    ensureSuperAttackBeforeDeath(attackingCard, false);
    ensureSuperAttackBeforeDeath(defendingCard, true);

    const isSuperAttack = attackingCard.superAttack >= 100;
    const damage = calculateDamage(attackingCard.value, isSuperAttack);

    console.log('Enemy attack:', {
      attackingCard: attackingCard.id,
      defendingCard: defendingCard.id,
      isSuperAttack,
      damage
    });

    // Если это супер удар, сбрасываем шкалу
    if (isSuperAttack) {
      dispatch(useSuperAttack({ cardId: attackingCard.id, isPlayerCard: false }));
    }

    dispatch(setAnimation({
      attackingCardId: attackingCard.id,
      defendingCardId: defendingCard.id
    }));

    const newHealth = defendingCard.health - damage;

    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: defendingCard.id,
        newHealth,
        isPlayerCard: true
      }));

      // Увеличиваем шкалу супер удара атакующей карты
      if (!isSuperAttack) {
        const attackerSuperGain = calculateSuperAttackGain(damage, true);
        dispatch(updateSuperAttack({
          cardId: attackingCard.id,
          newSuperAttack: Math.min(100, attackingCard.superAttack + attackerSuperGain),
          isPlayerCard: false
        }));
      }

      // Увеличиваем шкалу супер удара защищающейся карты
      const defenderSuperGain = calculateSuperAttackGain(damage, false);
      dispatch(updateSuperAttack({
        cardId: defendingCard.id,
        newSuperAttack: Math.min(100, defendingCard.superAttack + defenderSuperGain),
        isPlayerCard: true
      }));

      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: defendingCard.id,
            isPlayerCard: true
          }));

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
  }, [dispatch, canAttack, getRandomAliveCard, checkBattleEndByCards, ensureSuperAttackBeforeDeath]);

  // ★★★ РУЧНАЯ АТАКА ИГРОКА ★★★
  const performAttack = useCallback(() => {
    const currentState = stateRef.current;
    
    if (currentState.battleMode === 'auto') {
      console.log('В автоматическом режиме атака не требуется');
      return;
    }

    console.log('performAttack started:', {
      playerCard: currentState.selectedPlayerCard,
      enemyCard: currentState.selectedEnemyCard
    });

    if (!canAttack()) {
      console.log('Атака невозможна: нет живых карт');
      dispatch(resetSelection());
      return;
    }

    if (!currentState.isPlayerTurn || 
        !currentState.selectedPlayerCard || 
        !currentState.selectedEnemyCard) {
      console.log('Attack conditions not met');
      return;
    }

    const playerCard = currentState.selectedPlayerCard;
    const enemyCard = currentState.selectedEnemyCard;

    if (playerCard.health <= 0 || enemyCard.health <= 0) {
      console.log('Одна из карт мертва');
      dispatch(resetSelection());
      return;
    }

    // Проверяем гарантию супер удара перед смертью
    ensureSuperAttackBeforeDeath(playerCard, true);
    ensureSuperAttackBeforeDeath(enemyCard, false);

    const isSuperAttack = playerCard.superAttack >= 100;
    const damage = calculateDamage(playerCard.value, isSuperAttack);

    // Если это супер удар, сбрасываем шкалу
    if (isSuperAttack) {
      dispatch(useSuperAttack({ cardId: playerCard.id, isPlayerCard: true }));
    }

    dispatch(setAnimation({
      attackingCardId: playerCard.id,
      defendingCardId: enemyCard.id
    }));

    const newHealth = enemyCard.health - damage;
    
    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: enemyCard.id,
        newHealth,
        isPlayerCard: false
      }));

      // Увеличиваем шкалу супер удара атакующей карты
      if (!isSuperAttack) {
        const attackerSuperGain = calculateSuperAttackGain(damage, true);
        dispatch(updateSuperAttack({
          cardId: playerCard.id,
          newSuperAttack: Math.min(100, playerCard.superAttack + attackerSuperGain),
          isPlayerCard: true
        }));
      }

      // Увеличиваем шкалу супер удара защищающейся карты
      const defenderSuperGain = calculateSuperAttackGain(damage, false);
      dispatch(updateSuperAttack({
        cardId: enemyCard.id,
        newSuperAttack: Math.min(100, enemyCard.superAttack + defenderSuperGain),
        isPlayerCard: false
      }));

      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: enemyCard.id,
            isPlayerCard: false
          }));

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
  }, [dispatch, enemyTurn, checkBattleEndByCards, canAttack, ensureSuperAttackBeforeDeath]);

  // ★★★ АВТОМАТИЧЕСКАЯ АТАКА ИГРОКА ★★★
  const autoPlayerAttack = useCallback(() => {
    console.log('Автоматическая атака игрока');
    
    const currentState = stateRef.current;
    
    if (!canAttack()) {
      console.log('Авто-атака невозможна: нет живых карт');
      checkBattleEndByCards();
      return;
    }
    
    const randomPlayerCard = getRandomAliveCard(currentState.playerCards);
    const randomEnemyCard = getRandomAliveCard(currentState.enemyCards);
    
    if (!randomPlayerCard || !randomEnemyCard) {
      console.log('Не найдены карты для авто-атаки');
      checkBattleEndByCards();
      return;
    }

    // Проверяем гарантию супер удара перед смертью
    ensureSuperAttackBeforeDeath(randomPlayerCard, true);
    ensureSuperAttackBeforeDeath(randomEnemyCard, false);

    const isSuperAttack = randomPlayerCard.superAttack >= 100;
    const damage = calculateDamage(randomPlayerCard.value, isSuperAttack);
    
    console.log('Авто-атака:', {
      playerCard: randomPlayerCard.id,
      enemyCard: randomEnemyCard.id,
      isSuperAttack,
      damage
    });
    
    // Если это супер удар, сбрасываем шкалу
    if (isSuperAttack) {
      dispatch(useSuperAttack({ cardId: randomPlayerCard.id, isPlayerCard: true }));
    }
    
    dispatch(selectPlayerCard(randomPlayerCard));
    dispatch(selectEnemyCard(randomEnemyCard));
    
    dispatch(setAnimation({
      attackingCardId: randomPlayerCard.id,
      defendingCardId: randomEnemyCard.id
    }));
    
    const newHealth = randomEnemyCard.health - damage;
    
    setTimeout(() => {
      dispatch(updateCardHealth({
        cardId: randomEnemyCard.id,
        newHealth,
        isPlayerCard: false
      }));

      // Увеличиваем шкалу супер удара атакующей карты
      if (!isSuperAttack) {
        const attackerSuperGain = calculateSuperAttackGain(damage, true);
        dispatch(updateSuperAttack({
          cardId: randomPlayerCard.id,
          newSuperAttack: Math.min(100, randomPlayerCard.superAttack + attackerSuperGain),
          isPlayerCard: true
        }));
      }

      // Увеличиваем шкалу супер удара защищающейся карты
      const defenderSuperGain = calculateSuperAttackGain(damage, false);
      dispatch(updateSuperAttack({
        cardId: randomEnemyCard.id,
        newSuperAttack: Math.min(100, randomEnemyCard.superAttack + defenderSuperGain),
        isPlayerCard: false
      }));
      
      if (newHealth <= 0) {
        setTimeout(() => {
          dispatch(removeCard({
            cardId: randomEnemyCard.id,
            isPlayerCard: false
          }));
          
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
  }, [dispatch, enemyTurn, checkBattleEndByCards, canAttack, getRandomAliveCard, ensureSuperAttackBeforeDeath]);
  
  // ★★★ СБРОС СОСТОЯНИЯ БОЯ ★★★
  const resetBattleState = useCallback(() => {
    battleEndedRef.current = false;
  }, []);

  // ★★★ useEffect ДЛЯ АВТОМАТИЧЕСКОГО РЕЖИМА ★★★
  useEffect(() => {
    if (gameState.battleMode === 'auto' && 
        gameState.isPlayerTurn && 
        !battleEndedRef.current) {
      
      const timer = setTimeout(() => {
        const currentState = stateRef.current;
        const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
        const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
        
        if (alivePlayerCards.length > 0 && aliveEnemyCards.length > 0) {
          autoPlayerAttack();
        } else {
          checkBattleEndByCards();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.battleMode, gameState.isPlayerTurn, autoPlayerAttack, checkBattleEndByCards]);

  const closeBattleResultModal = useCallback(() => {
    battleEndedRef.current = false;
    dispatch(hideBattleResultModal());
  }, [dispatch]);

  return {
    performAttack,
    enemyTurn,
    autoPlayerAttack,
    closeBattleResultModal,
    resetBattleState
  };
};
