// src/hooks/useBattleLogic.js
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useBattleLogic = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);

  // Чистая логика без API вызовов
  const calculateDamage = (attackerValue, isSuperAttack = false) => {
    const baseDamage = Math.max(1, attackerValue - Math.floor(Math.random() * 3));
    return isSuperAttack ? Math.floor(baseDamage * 1.8) : baseDamage;
  };

  const calculateSuperAttackGain = (damage, isAttacking = true) => {
    const baseGain = isAttacking ? damage * 4 : damage * 3;
    return Math.min(30, baseGain + Math.random() * (isAttacking ? 20 : 15));
  };

  const checkBattleEnd = useCallback((playerCards, enemyCards) => {
    const alivePlayer = playerCards.filter(card => card.health > 0);
    const aliveEnemy = enemyCards.filter(card => card.health > 0);
    
    if (alivePlayer.length === 0) return 'defeat';
    if (aliveEnemy.length === 0) return 'victory';
    return null;
  }, []);

  return {
    calculateDamage,
    calculateSuperAttackGain,
    checkBattleEnd
  };
};
