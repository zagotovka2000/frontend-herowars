import React, { useState, useEffect } from 'react';
import BattleField2D from './BattleField2D';
import battleService from '../services/battleService';

const BattleArena = () => {
  const [battleState, setBattleState] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startBattle = async (attackers, defenders) => {
    setLoading(true);
    setError(null);
    
    try {
      const battleData = await battleService.startBattle(attackers, defenders);
      setBattleState(battleData);
    } catch (err) {
      setError('Ошибка запуска битвы: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBattleAction = async (action) => {
    try {
      const result = await battleService.performAction(action);
      
      // Обновляем состояние битвы на основе результата
      setBattleState(prevState => ({
        ...prevState,
        currentTurn: result.nextTurn,
        // Обновляем здоровье юнитов и т.д.
      }));
      
      // Запускаем анимацию
      setCurrentAnimation({
        type: 'attack',
        source: action.source,
        target: action.target
      });
      
    } catch (err) {
      console.error('Action error:', err);
    }
  };

  // Пример запуска битвы
  useEffect(() => {
    // Запускаем битву с тестовыми данными
    startBattle([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
  }, []);

  if (loading) {
    return <div>Загрузка битвы...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Ошибка: {error}</div>
        <button onClick={() => startBattle([1,2,3,4,5], [1,2,3,4,5])}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!battleState) {
    return <div>Подготовка к битве...</div>;
  }

  return (
    <div className="battle-container">
      <BattleField2D 
        battleState={battleState}
        onAction={handleBattleAction}
        currentTurn={battleState.currentTurn}
        currentAnimation={currentAnimation}
      />
      
      {/* Дополнительная информация о битве */}
      <div className="battle-debug">
        <h4>Отладочная информация:</h4>
        <div>Текущий ход: {battleState.currentTurn}</div>
        <div>Атакующих: {battleState.attackers?.length}</div>
        <div>Защитников: {battleState.defenders?.length}</div>
        <div>Статус: {battleState.battleStatus}</div>
      </div>
    </div>
  );
};

export default BattleArena;
