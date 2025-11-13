// src/components/Quests/Quests.js
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import LoadingState from '../Common/LoadingState';
import './Quests.css';

const Quests = () => {
  const { user } = useAppSelector(state => state.app);
  const { getAvailableQuests, updateQuestProgress, claimQuestReward } = useApi();
  
  // Состояния компонента
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingQuest, setClaimingQuest] = useState(null);

  // Эффект для загрузки квестов при монтировании
  useEffect(() => {
    if (user) {
      loadQuests();
    }
  }, [user]);

  // Функция загрузки квестов
  const loadQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableQuests = await getAvailableQuests(user.id);
      setQuests(availableQuests);
    } catch (err) {
      console.error('Ошибка загрузки квестов:', err);
      setError('Не удалось загрузить квесты');
    } finally {
      setLoading(false);
    }
  };

  // Функция получения награды за квест
  const handleClaimReward = async (questId) => {
    try {
      setClaimingQuest(questId);
      await claimQuestReward(questId, user.id);
      await loadQuests(); // Перезагружаем квесты после получения награды
    } catch (error) {
      console.error('Ошибка получения награды:', error);
      setError('Ошибка получения награды');
    } finally {
      setClaimingQuest(null);
    }
  };

  // Функция получения прогресса квеста
  const getQuestProgress = (quest) => {
    // Временная логика - в реальном приложении прогресс будет приходить с сервера
    return quest.QuestProgresses?.[0] || { 
      progress: Math.min(quest.objective?.target || 1, Math.floor(Math.random() * (quest.objective?.target || 1))), 
      completed: false, 
      claimed: false 
    };
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="quests-screen">
        <BackButton />
        <ResourceBar />
        <LoadingState message="Загрузка квестов..." />
      </div>
    );
  }

  return (
    <div className="quests-screen">
      <BackButton />
      <ResourceBar />
      
      {/* Заголовок */}
      <div className="quests-header">
        <h2>📜 Ежедневные Квесты</h2>
        <p>Выполняйте задания и получайте награды!</p>
      </div>

      {/* Ошибка загрузки */}
      {error && (
        <div className="quests-error">
          <div className="error-icon">❌</div>
          <p>{error}</p>
          <button onClick={loadQuests}>Попробовать снова</button>
        </div>
      )}

      {/* Список квестов */}
      <div className="quests-list">
        {quests.map(quest => {
          const progress = getQuestProgress(quest);
          const isClaiming = claimingQuest === quest.id;
          
          return (
            <div key={quest.id} className={`quest-item ${progress.completed ? 'completed' : ''}`}>
              <div className="quest-info">
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
                <div className="quest-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${(progress.progress / (quest.objective?.target || 1)) * 100}%` 
                      }} 
                    />
                  </div>
                  <span className="progress-text">
                    {progress.progress}/{quest.objective?.target || 1}
                  </span>
                </div>
              </div>
              
              <div className="quest-rewards">
                <div className="rewards-list">
                  {quest.reward?.gold && (
                    <span className="reward-gold">💰 {quest.reward.gold}</span>
                  )}
                  {quest.reward?.exp && (
                    <span className="reward-exp">⭐ {quest.reward.exp}</span>
                  )}
                  {quest.reward?.items?.map((item, index) => (
                    <span key={index} className="reward-item">🎁 {item.name}</span>
                  ))}
                </div>
                
                <div className="quest-actions">
                  {progress.completed ? (
                    progress.claimed ? (
                      <button className="quest-btn claimed" disabled>
                        🎉 Получено
                      </button>
                    ) : (
                      <button 
                        className="quest-btn claim"
                        onClick={() => handleClaimReward(quest.id)}
                        disabled={isClaiming}
                      >
                        {isClaiming ? 'Получение...' : 'Получить награду'}
                      </button>
                    )
                  ) : (
                    <button className="quest-btn incomplete" disabled>
                      {progress.progress}/{quest.objective?.target || 1}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Сообщение если квестов нет */}
        {quests.length === 0 && !error && (
          <div className="no-quests">
            <div className="no-quests-icon">🎉</div>
            <p>Все квесты выполнены!</p>
            <p>Новые задания появятся завтра.</p>
          </div>
        )}
      </div>

      {/* ✅ ДОБАВЛЕНО: информация о перезагрузке квестов */}
      <div className="quests-refresh-info">
        <p>🕒 Новые квесты появляются каждый день в 00:00</p>
      </div>
    </div>
  );
};

export default Quests;
