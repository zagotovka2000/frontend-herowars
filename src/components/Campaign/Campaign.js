// src/components/Campaign/Campaign.js
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { navigateTo } from '../../store/slices/navigationSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
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
  
  const { loadCampaigns, loadCampaignProgress, loading: apiLoading } = useApi();
  const campaigns = useAppSelector(state => state.api.campaigns);
  const campaignProgress = useAppSelector(state => state.api.campaignProgress);
  const userCards = useAppSelector(state => state.app.cards || []);

  const { startCampaignBattle, completeCampaignBattle } = useBattle();
  const { handleBattleComplete: handleGameEvent } = useGameEvents();
  
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ ДОБАВЛЕНО: useRef для отслеживания mounted состояния
  const isMounted = useRef(true);

  // Массив эмодзи для уровней
  const levelImages = [
    '🎯', '⚔️', '🏹', '🐉', '🏛️',
    '❄️', '🔥', '☁️', '🌑', '👑'
  ];

  // ✅ ИСПРАВЛЕНО: useEffect с cleanup функцией
  useEffect(() => {
    // Устанавливаем флаг mounted при монтировании
    isMounted.current = true;

    return () => {
      // Сбрасываем флаг при размонтировании
      isMounted.current = false;
    };
  }, []);

  // Эффект для инициализации кампании при загрузке пользователя
  useEffect(() => {
    if (user && user.id) {
      initializeCampaign();
    }
  }, [user]);

  // Эффект для установки текущей кампании после загрузки
  useEffect(() => {
    if (campaigns.length > 0 && !currentCampaign) {
      setCurrentCampaign(campaigns[0]);
    }
  }, [campaigns, currentCampaign]);

  // Функция инициализации кампании с проверкой mounted
  const initializeCampaign = async () => {
    try {
      setLoading(true);
      
      // ✅ ИСПРАВЛЕНО: проверяем mounted перед обновлением состояния
      const campaignsData = await loadCampaigns(user.id);
      const progressData = await loadCampaignProgress(user.id);
      
      if (isMounted.current) {
        // Обновляем состояние только если компонент еще mounted
        setLoading(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки кампании:', error);
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Функция для получения списка завершенных уровней
  const getCompletedLevels = () => {
    if (!currentCampaign || !campaignProgress[currentCampaign.id]) return [];
    
    return campaignProgress[currentCampaign.id].levels
      .filter(progress => progress.completed)
      .map(progress => progress.levelId) || [];
  };

  // Функция проверки доступности уровня
  const isLevelAvailable = (level) => {
    const completedLevels = getCompletedLevels();
    
    // Первый уровень всегда доступен
    if (level.levelNumber === 1) return true;
    
    // Уровень доступен если предыдущий завершен
    const previousLevel = currentCampaign.levels.find(l => l.levelNumber === level.levelNumber - 1);
    return previousLevel && completedLevels.includes(previousLevel.id);
  };

  // Функция получения статуса уровня
  const getLevelStatus = (level) => {
    const completedLevels = getCompletedLevels();
    
    if (completedLevels.includes(level.id)) return 'completed';
    if (isLevelAvailable(level)) return 'available';
    return 'locked';
  };

  // Обработчик клика по уровню с проверкой mounted
  const handleLevelClick = async (level) => {
    if (!isLevelAvailable(level)) return;

    if (user.energy < (level.energyCost || 5)) {
      if (isMounted.current) {
        setShowEnergyModal(true);
      }
      return;
    }

    if (isMounted.current) {
      setCurrentLevel(level);
      setShowCardModal(true);
    }
  };

  // Обработчик начала битвы после выбора карт с проверкой mounted
  const handleBattleStart = async (selectedCards) => {
    try {
      console.log('🎯 Начинаем битву с карточками:', selectedCards);
     
      await startCampaignBattle(user.id, currentLevel.id, user.energy);
      
      // ✅ ИСПРАВЛЕНО: проверяем mounted перед навигацией
      if (isMounted.current) {
        // Переходим на арену
        dispatch(navigateTo('arena'));
      }
    } catch (error) {
      console.error('Ошибка начала уровня:', error);
      if (isMounted.current) {
        setShowCardModal(false);
      }
    }
  };

  // Обработчик завершения битвы с проверкой mounted
  const handleBattleComplete = async (isVictory) => {
    if (isVictory && currentLevel) {
      try {
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

  // Обработчики закрытия модальных окон
  const handleCloseModal = () => {
    // Просто закрываем модальное окно
  };

  const handleCloseEnergyModal = () => {
    if (isMounted.current) {
      setShowEnergyModal(false);
    }
  };

  const handleCloseCardModal = () => {
    if (isMounted.current) {
      setShowCardModal(false);
      setCurrentLevel(null);
    }
  };

  // Отображение загрузки
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

  // Отображение ошибки если кампании не найдены
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
          const isDisabled = status === 'locked' || (user.energy || 0) < level.energyCost;
          
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
        currentEnergy={user.energy || 0}
      />

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
