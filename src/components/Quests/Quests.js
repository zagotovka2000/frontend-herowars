import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';


const Quests = () => {
  const { user } = useAppSelector(state => state.app);
  const { getAvailableQuests, updateQuestProgress, claimQuestReward } = useApi();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadQuests();
    }
  }, [user]);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const availableQuests = await getAvailableQuests(user.id);
      setQuests(availableQuests);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки квестов:', err);
      setError('Не удалось загрузить квесты');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (questId) => {
    try {
      await claimQuestReward(questId, user.id);
      await loadQuests(); // Перезагружаем квесты после получения награды
    } catch (error) {
      console.error('Ошибка получения награды:', error);
      setError('Ошибка получения награды');
    }
  };

  const getQuestProgress = (quest) => {
    // Временная логика - в реальном приложении прогресс будет приходить с сервера
    return quest.QuestProgresses?.[0] || { progress: 0, completed: false, claimed: false };
  };

  if (loading) {
    return (
      <div className="quests-screen">
        <BackButton />
        <ResourceBar />
        <div className="quests-loading">
          <div className="loading-spinner">📜</div>
          <p>Загрузка квестов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quests-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="quests-header">
        <h2>📜 Ежедневные Квесты</h2>
        <p>Выполняйте задания и получайте награды!</p>
      </div>

      {error && (
        <div className="quests-error">
          <p>{error}</p>
          <button onClick={loadQuests}>Попробовать снова</button>
        </div>
      )}

      <div className="quests-list">
        {quests.map(quest => {
          const progress = getQuestProgress(quest);
          
          return (
            <div key={quest.id} className={`quest-item ${progress.completed ? 'completed' : ''}`}>
              <div className="quest-info">
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
                <div className="quest-progress">
                  Прогресс: {progress.progress}/{quest.objective?.target || 1}
                </div>
              </div>
              
              <div className="quest-rewards">
                <div className="rewards-list">
                  {quest.reward?.gold && <span className="reward-gold">💰 {quest.reward.gold}</span>}
                  {quest.reward?.exp && <span className="reward-exp">⭐ {quest.reward.exp}</span>}
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
                      >
                        Получить награду
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
        
        {quests.length === 0 && !error && (
          <div className="no-quests">
            <div className="no-quests-icon">🎉</div>
            <p>Все квесты выполнены!</p>
            <p>Новые задания появятся завтра.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quests;
