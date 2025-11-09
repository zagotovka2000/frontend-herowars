import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { navigateTo } from '../../store/slices/navigationSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import { fetchCampaigns, fetchCampaignProgress } from '../../store/slices/apiSlice';
import BattleResultModal from '../Common/BattleResultModal';
import CardSelectionModal from '../Common/CardSelectionModal/CardSelectionModal';
import EnergyModal from '../Common/EnergyModal/EnergyModal';
import './Campaign.css';
import { useApi } from '../../hooks/useApi';
import { useBattle } from '../../hooks/useBattle';
import { useGameEvents } from '../../hooks/useGameEvents';

const Campaign = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app);
  const { showBattleResultModal: showModal, battleResult } = useAppSelector(state => state.game);
  
  const {     loadCampaigns,     loadCampaignProgress,    loading: apiLoading   } = useApi();
  const campaigns = useAppSelector(state => state.api.campaigns);
  const campaignProgress = useAppSelector(state => state.api.campaignProgress);
  const userCards = useAppSelector(state => state.app.cards); // Карточки пользователя

  const { startCampaignBattle, completeCampaignBattle } = useBattle();
  const { handleBattleComplete: handleGameEvent } = useGameEvents();
  const [showCardModal, setShowCardModal] = useState(false); 

  const [currentCampaign, setCurrentCampaign] = useState(null);

  const [currentLevel, setCurrentLevel] = useState(null);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const levelImages = [
    '🎯', '⚔️', '🏹', '🐉', '🏛️',
    '❄️', '🔥', '☁️', '🌑', '👑'
  ];

  useEffect(() => {
    if (user) {
      initializeCampaign();
    }
  }, [user]);

  const initializeCampaign = async () => {
    try {
      setLoading(true);
      await dispatch(fetchCampaigns(user.id)).unwrap();
      await dispatch(fetchCampaignProgress(user.id)).unwrap();
      
      // Устанавливаем первую кампанию как текущую
      if (campaigns.length > 0) {
        setCurrentCampaign(campaigns[0]);
      }
    } catch (error) {
      console.error('Ошибка загрузки кампании:', error);
    } finally {
      setLoading(false);
    }
  };
  // ✅ ДОБАВЛЕНО: обновляем currentCampaign когда campaigns загружены
  useEffect(() => {
   if (campaigns.length > 0 && !currentCampaign) {
     setCurrentCampaign(campaigns[0]);
   }
 }, [campaigns, currentCampaign]);
  // Получаем completed levels из прогресса
  const getCompletedLevels = () => {
    if (!currentCampaign || !campaignProgress[currentCampaign.id]) return [];
    
    return campaignProgress[currentCampaign.id].levels
      .filter(progress => progress.completed)
      .map(progress => progress.levelId) || [];;
  };

  const isLevelAvailable = (level) => {
    const completedLevels = getCompletedLevels();
    
    // Первый уровень всегда доступен
    if (level.levelNumber === 1) return true;
    
    // Уровень доступен если предыдущий завершен
    const previousLevel = currentCampaign.levels.find(l => l.levelNumber === level.levelNumber - 1);
    return previousLevel && completedLevels.includes(previousLevel.id);
  };

  const getLevelStatus = (level) => {
    const completedLevels = getCompletedLevels();
    
    if (completedLevels.includes(level.id)) return 'completed';
    if (isLevelAvailable(level)) return 'available';
    return 'locked';
  };

  const handleLevelClick = async (level) => {
   if (!isLevelAvailable(level)) return;

   if (user.energy < (level.energyCost || 5)) {
     setShowEnergyModal(true);
     return;
   }

   setCurrentLevel(level);
   setShowCardModal(true); // Открываем модальное окно выбора карточек
 };

 // ✅ ДОБАВЛЕНО: обработчик начала битвы после выбора карточек
 const handleBattleStart = async (selectedCards) => {
   try {
      console.log('🎯 Начинаем битву с карточками:', selectedCards);
      console.log('📋 Данные для битвы:', {
        userId: user.id,
        levelId: currentLevel.id,
        userEnergy: user.energy
      });
     
     // Передаем user.id, level.id и user.energy
     await startCampaignBattle(user.id, currentLevel.id, user.energy);
     
     // Переходим на арену
     dispatch(navigateTo('arena'));
   } catch (error) {
     console.error('Ошибка начала уровня:', error);
     setShowCardModal(false);
   }
 };

  const handleBattleComplete = async (isVictory) => {
    if (isVictory && currentLevel) {
      try {
        // Завершаем битву на сервере
        await completeCampaignBattle(currentLevel.id, true);
        
        // Обновляем прогресс
        await loadCampaignProgress(user.id);
        
        // Обрабатываем игровые события
        await handleGameEvent(true, 'campaign');
      } catch (error) {
        console.error('Ошибка завершения битвы:', error);
      }
    }
  };

  const handleCloseModal = () => {
    // Просто закрываем модальное окно
  };

  const handleCloseEnergyModal = () => {
    setShowEnergyModal(false);
  };
  // ✅ ДОБАВЛЕНО: закрытие модального окна выбора карточек
  const handleCloseCardModal = () => {
   setShowCardModal(false);
   setCurrentLevel(null);
 };
  if (loading || apiLoading) {
    return (
      <div className="campaign-screen">
        <BackButton />
        <ResourceBar />
        <div className="campaign-loading">
          <div className="loading-spinner">⚔️</div>
          <p>Загрузка кампании...</p>
        </div>
      </div>
    );
  }

  if (!currentCampaign) {
    return (
      <div className="campaign-screen">
        <BackButton />
        <ResourceBar />
        <div className="campaign-error">
          <p>Кампании не найдены</p>
        </div>
      </div>
    );
  }

  const completedLevels = getCompletedLevels();
  const totalLevels = currentCampaign.levels?.length || 0;

  return (
    <div className="campaign-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="campaign-header">
        <h2>{currentCampaign.name}</h2>
        <div className="campaign-progress">
          Прогресс: {completedLevels.length}/{totalLevels}
        </div>
        {currentCampaign.description && (
          <div className="campaign-description">
            {currentCampaign.description}
          </div>
        )}
      </div>

      <div className="campaign-levels-grid">
        {currentCampaign.levels?.map(level => {
          const status = getLevelStatus(level);
          const isDisabled = status === 'locked' || user.energy < level.energyCost;
          
          return (
            <div
              key={level.id}
              className={`campaign-level-item ${status} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleLevelClick(level)}
            >
              <div className="level-icon">
                {levelImages[level.levelNumber - 1] || '⚔️'}
              </div>
              <div className="level-info">
                <div className="level-name">Уровень {level.levelNumber}</div>
                <div className="level-cost">⚡ {level.energyCost}</div>
                <div className="level-rewards">
                  <span>💰 {level.goldReward}</span>
                  <span>⭐ {level.expReward}</span>
                </div>
                {status === 'completed' && <div className="level-completed">✓</div>}
                {status === 'locked' && <div className="level-locked">🔒</div>}
              </div>
            </div>
          );
        })}
      </div>

      <BattleResultModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        isVictory={battleResult === 'victory'}
        onBattleComplete={handleBattleComplete}
        showContinueButton={false}
      />

      <EnergyModal 
        isOpen={showEnergyModal}
        onClose={handleCloseEnergyModal}
        requiredEnergy={currentLevel?.energyCost || 6}
        currentEnergy={user.energy}
      />
            {/* ✅ ДОБАВЛЕНО: Модальное окно выбора карточек */}
            <CardSelectionModal
        isOpen={showCardModal}
        onClose={handleCloseCardModal}
        onBattleStart={handleBattleStart}
        userCards={userCards}
        level={currentLevel?.levelNumber || 1}
      />
    </div>
  );
};

export default Campaign;
