// src/hooks/useBattleLogic.js
import { useCallback } from 'react';

export const useBattleLogic = () => {

  // Функция для генерации карт (перенесена из cardUtils.js)
  const generateCards = useCallback((count, config, isPlayer = true) => {
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
 }, []);

    // Функция для расчета урона (перенесена из cardUtils.js)
  const calculateDamage = (attackerValue, isSuperAttack = false) => {
    const baseDamage = Math.max(1, attackerValue - Math.floor(Math.random() * 3));
    return isSuperAttack ? Math.floor(baseDamage * 1.8) : baseDamage;
  };

  // Функция для расчета прироста шкалы супер атаки
  const calculateSuperAttackGain = (damage, isAttacking = true) => {
    const baseGain = isAttacking ? damage * 4 : damage * 3;
    return Math.min(30, baseGain + Math.random() * (isAttacking ? 20 : 15));
  };

  // Функция для проверки окончания битвы
  const checkBattleEnd = useCallback((playerCards, enemyCards) => {
    const alivePlayer = playerCards.filter(card => card.health > 0);
    const aliveEnemy = enemyCards.filter(card => card.health > 0);
    
    if (alivePlayer.length === 0) return 'defeat';
    if (aliveEnemy.length === 0) return 'victory';
    return null;
  }, []);

  return {
    generateCards, // ✅ ДОБАВЛЕНО: перенесена из cardUtils.js
    calculateDamage, // ✅ ДОБАВЛЕНО: перенесена из cardUtils.js
    calculateSuperAttackGain,
    checkBattleEnd
  };
};
