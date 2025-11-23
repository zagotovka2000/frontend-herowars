// Arena.js - ОБНОВЛЕННАЯ ВЕРСИЯ
import React, { useEffect, useState,useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { navigateBack } from '../../store/slices/navigationSlice';
import { initGame } from '../../store/slices/gameSlice';
import GameBoard from '../GameBoard/GameBoard';
import Controls from '../Controls/Controls';
import './Arena.css';
import BattleResultModal from '../Common/BattleResultModal';
import { useBattle } from '../../hooks/useBattle';

const Arena = () => {
  const dispatch = useAppDispatch();
  const [battleInitialized, setBattleInitialized] = useState(false);
  const [battleCompleteCallback, setBattleCompleteCallback] = useState(null);
  const { user } = useAppSelector(state => state.app); 
  const { 
    battleType, 
    currentLevel, 
    showBattleResultModal: showModal, 
    battleResult 
  } = useAppSelector(state => state.game);
  const { completeCampaignBattle } = useBattle();
  // Эффект для инициализации битвы при монтировании компонента
  useEffect(() => {
    if (!battleInitialized) {
      console.log('🎮 Инициализация арены...', { battleType, currentLevel });
      dispatch(initGame());
      setBattleInitialized(true);
    }
  }, [dispatch, battleInitialized, battleType, currentLevel]);

  // Обработчик завершения битвы
  const handleBattleComplete = useCallback(async (isVictory) => {
   console.log('🏁 Битва завершена в Arena:', { isVictory, battleType, currentLevel, user });
   
   if (isVictory && battleType === 'campaign' && currentLevel && user) {
     try {
       console.log('🎯 Завершение кампании, уровень:', currentLevel.id);
       
       // Вызываем API для завершения уровня и получения наград
       const result = await completeCampaignBattle(currentLevel.id, true);
       console.log('✅ Результат завершения уровня:', result);
       
     } catch (error) {
       console.error('❌ Ошибка завершения битвы:', error);
     }
   }
 }, [battleType, currentLevel, user, completeCampaignBattle]);

  // Обработчик выхода из арены
  const handleExit = () => {
    console.log('🎮 Выход из арены');
    dispatch(navigateBack());
  };
  // Обработчик закрытия модального окна результатов
  const handleCloseModal = () => {
   console.log('🔒 Закрытие модального окна результатов');
   // Здесь можно добавить дополнительную логику при закрытии модального окна
 };
 return (
   <div className="arena">
     <div className="arena-header">
       <button className="back-button" onClick={handleExit}>
         ← Назад
       </button>
       <h1>⚔️ Арена</h1>
       <div className="battle-info">
         <span>Режим: {battleType === 'campaign' ? 'Кампания' : 'PvP'}</span>
         <span>Ход: Игрока</span>
       </div>
     </div>
     
     <div className="arena-content">
       <GameBoard onBattleEnd={handleBattleComplete} />
       <Controls />
     </div>

     {/* ✅ ДОБАВЛЕНО: BattleResultModal для отображения результатов */}
     <BattleResultModal 
       isOpen={showModal}
       onClose={handleCloseModal}
       isVictory={battleResult === 'victory'}
       onBattleComplete={handleBattleComplete}
       showContinueButton={true}
     />
   </div>
 );
};

export default Arena;
