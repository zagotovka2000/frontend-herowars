// src/components/DailyReward/DailyReward.js
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import LoadingState from '../Common/LoadingState';
import './DailyReward.css';

const DailyReward = () => {
  const { user } = useAppSelector(state => state.app);
  const { getDailyRewardStatus, claimDailyReward } = useApi();
  
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [error, setError] = useState(null);
  const [rewardResult, setRewardResult] = useState(null);

  console.log('🎁 DailyReward компонент загружен, user:', user);

  useEffect(() => {
    // ✅ ИСПРАВЛЕНО: проверяем наличие telegramId или используем id как fallback
    const userIdentifier = user?.telegramId || user?.id;
    
    if (user && userIdentifier) {
      console.log('🔄 Запускаем загрузку данных наград для:', userIdentifier);
      loadRewardData(userIdentifier);
    } else {
      console.log('❌ User или идентификатор не определен:', user);
      setError("Данные пользователя не загружены");
      setLoading(false);
    }
  }, [user]);

  // Загрузка данных о наградах
  const loadRewardData = async (userIdentifier) => {
    try {
      console.log('📡 Начинаем загрузку данных наград...');
      setLoading(true);
      setError(null);
      
      console.log('👤 Идентификатор для запроса:', userIdentifier);
      const data = await getDailyRewardStatus(userIdentifier);
      console.log('✅ Данные наград получены:', data);
      
      setRewardData(data);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки данных наград:', error);
      setError('Не удалось загрузить данные о наградах: ' + error.message);
    } finally {
      setLoading(false);
      console.log('🏁 Загрузка данных завершена');
    }
  };

  // Получение награды
  const handleClaimReward = async (rewardType) => {
    if (claiming || !canClaimReward(rewardType)) {
      console.log('⏸️ Награда уже получается или недоступна');
      return;
    }
    
    // ✅ ИСПРАВЛЕНО: используем доступный идентификатор
    const userIdentifier = user?.telegramId || user?.id;
    
    if (!userIdentifier) {
      setError('Не удалось определить идентификатор пользователя');
      return;
    }
    
    console.log('🎁 Начинаем получение награды типа:', rewardType);
    setClaiming(rewardType);
    setError(null);
    
    try {
      const result = await claimDailyReward(userIdentifier, rewardType);
      console.log('✅ Награда получена успешно:', result);
      setRewardResult(result);
      
      // Обновляем данные после получения награды
      await loadRewardData(userIdentifier);
      
    } catch (error) {
      console.error('❌ Ошибка получения награды:', error);
      setError('Не удалось получить награду: ' + error.message);
    } finally {
      setClaiming(null);
      console.log('🏁 Процесс получения награды завершен');
    }
  };

  // Таймеры для каждой награды
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!rewardData) return;

    console.log('⏰ Запускаем таймеры для наград');
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeLeft = {};

      Object.entries(rewardData.rewards || {}).forEach(([type, reward]) => {
        if (reward && reward.nextAvailableAt && new Date(reward.nextAvailableAt) > now) {
          const diff = new Date(reward.nextAvailableAt) - now;
          newTimeLeft[type] = formatTime(diff);
        } else {
          newTimeLeft[type] = null;
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => {
      console.log('🧹 Очищаем таймеры');
      clearInterval(timer);
    };
  }, [rewardData]);

  // Форматирование времени
  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`;
    } else if (hours > 0) {
      return `${hours} ч. ${minutes} мин. ${seconds} сек.`;
    } else {
      return `${minutes} мин. ${seconds} сек.`;
    }
  };

  // Проверка возможности получения награды
  const canClaimReward = (rewardType) => {
    const canClaim = rewardData?.rewards?.[rewardType]?.canClaim;
    console.log(`🔍 Проверка доступности награды ${rewardType}:`, canClaim);
    return canClaim;
  };

  // Данные наград
  const rewardsConfig = {
    gray: {
      name: 'Ежедневная награда',
      description: 'Доступна каждые 24 часа',
      icon: '📦',
      color: '#95a5a6',
      rewardPreview: 'Серый предмет'
    },
    green: {
      name: 'Редкая награда', 
      description: 'Доступна каждые 72 часа',
      icon: '🎁',
      color: '#2ecc71',
      rewardPreview: 'Зеленая карта'
    },
    blue: {
      name: 'Эпическая награда',
      description: 'Доступна раз в неделю',
      icon: '💎',
      color: '#3498db',
      rewardPreview: 'Синяя карта'
    }
  };

  if (loading) {
    console.log('⏳ Показываем экран загрузки');
    return (
      <div className="daily-reward-screen">
        <BackButton />
        <ResourceBar />
        <LoadingState message="Загрузка наград..." />
      </div>
    );
  }

  if (error && !rewardData) {
    console.log('❌ Показываем экран ошибки:', error);
    return (
      <div className="daily-reward-screen">
        <BackButton />
        <ResourceBar />
        <div className="daily-reward-error">
          <div className="error-icon">❌</div>
          <p>{error}</p>
          <button onClick={() => loadRewardData(user?.telegramId || user?.id)}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  console.log('🎯 Рендерим основной интерфейс DailyReward');
  return (
    <div className="daily-reward-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="daily-reward-content">
        {/* Заголовок */}
        <div className="reward-header">
          <h2>🎁 Ежедневные Награды</h2>
          <p>Получайте награды для получения ценных предметов и карт!</p>
        </div>

        {/* Контейнер наград */}
        <div className="rewards-container">
          {Object.entries(rewardsConfig).map(([rewardType, config]) => {
            const reward = rewardData?.rewards?.[rewardType];
            const canClaim = canClaimReward(rewardType);
            const isClaiming = claiming === rewardType;

            console.log(`🎲 Рендерим награду ${rewardType}:`, { canClaim, isClaiming });

            return (
              <div
                key={rewardType}
                className={`reward-card ${rewardType} ${canClaim ? 'available' : 'cooldown'}`}
                style={{ borderColor: config.color }}
              >
                <div className="reward-header">
                  <div className="reward-icon">{config.icon}</div>
                  <div className="reward-info">
                    <h3>{config.name}</h3>
                    <p>{config.rewardPreview}</p>
                    {reward?.streak > 0 && (
                      <div className="streak-info">Серия: {reward.streak} дней</div>
                    )}
                  </div>
                </div>

                <div className="reward-description">
                  <p>{config.description}</p>
                </div>

                <div className="reward-actions">
                  {canClaim ? (
                    <button
                      className="claim-button"
                      onClick={() => handleClaimReward(rewardType)}
                      disabled={isClaiming}
                      style={{ backgroundColor: config.color }}
                    >
                      {isClaiming ? 'Получаем...' : 'Получить'}
                    </button>
                  ) : (
                    <div className="cooldown-timer">
                      <div className="timer-icon">⏰</div>
                      <div className="timer-text">
                        {timeLeft[rewardType] || 'Доступно скоро...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Модальное окно с наградой */}
        {rewardResult && (
          <div className="reward-modal-overlay">
            <div className="reward-modal">
              <div className="reward-modal-header">
                <h3>🎉 Поздравляем!</h3>
                <button 
                  className="close-modal"
                  onClick={() => setRewardResult(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="reward-content">
                <p className="reward-message">{rewardResult.message}</p>
                
                <div className="reward-items">
                  {rewardResult.gold > 0 && (
                    <div className="reward-item">
                      <span className="reward-icon">💰</span>
                      <span className="reward-amount">+{rewardResult.gold} золота</span>
                    </div>
                  )}
                  
                  {rewardResult.crystals > 0 && (
                    <div className="reward-item">
                      <span className="reward-icon">💎</span>
                      <span className="reward-amount">+{rewardResult.crystals} кристаллов</span>
                    </div>
                  )}
                  
                  {rewardResult.energy > 0 && (
                    <div className="reward-item">
                      <span className="reward-icon">⚡</span>
                      <span className="reward-amount">+{rewardResult.energy} энергии</span>
                    </div>
                  )}
                  
                  {rewardResult.items && rewardResult.items.map((item, index) => (
                    <div key={index} className="reward-item">
                      <span className="reward-icon">{item.icon}</span>
                      <span className="reward-amount">{item.name}</span>
                    </div>
                  ))}
                  
                  {rewardResult.cards && rewardResult.cards.map((card, index) => (
                    <div key={index} className="reward-item">
                      <span className="reward-icon">{card.icon}</span>
                      <span className="reward-amount">{card.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="reward-modal-actions">
                <button 
                  className="continue-button"
                  onClick={() => setRewardResult(null)}
                >
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Отображение ошибки если есть */}
        {error && (
          <div className="reward-error">
            <p>{error}</p>
            <button onClick={() => loadRewardData(user?.telegramId || user?.id)}>
              Обновить
            </button>
          </div>
        )}

        {/* Отладочная информация */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4>🔧 Отладочная информация:</h4>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>User telegramId:</strong> {user?.telegramId || 'отсутствует'}</p>
          <p><strong>Используемый идентификатор:</strong> {user?.telegramId || user?.id}</p>
          <p><strong>Reward Data:</strong> {rewardData ? 'Загружено' : 'Не загружено'}</p>
          <p><strong>Loading:</strong> {loading ? 'Да' : 'Нет'}</p>
          <p><strong>Claiming:</strong> {claiming || 'Нет'}</p>
          <button 
            onClick={() => console.log('User Data:', user)}
            style={{ marginRight: '10px' }}
          >
            Лог пользователя
          </button>
          <button 
            onClick={() => console.log('Reward Data:', rewardData)}
            style={{ marginRight: '10px' }}
          >
            Лог данных наград
          </button>
          <button onClick={() => loadRewardData(user?.telegramId || user?.id)}>
            Перезагрузить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
