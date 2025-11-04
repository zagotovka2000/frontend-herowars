import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import './DailyReward.css';

const DailyReward = () => {
  const { user } = useAppSelector(state => state.app);
  const { getDailyReward, claimDailyReward } = useApi();
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (user) {
      loadRewardData();
    }
  }, [user]);

  const loadRewardData = async () => {
    try {
      const data = await getDailyReward(user.id);
      setRewardData(data);
    } catch (error) {
      console.error('Ошибка загрузки данных награды:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    if (claiming) return;
    
    setClaiming(true);
    try {
      const result = await claimDailyReward(user.id);
      setRewardData(result);
      // Можно показать анимацию получения награды
    } catch (error) {
      console.error('Ошибка получения награды:', error);
      alert('Не удалось получить награду');
    } finally {
      setClaiming(false);
    }
  };

  const canClaim = rewardData && new Date(rewardData.nextAvailableAt) <= new Date();

  // Данные ежедневных наград (можно вынести в конфиг)
  const dailyRewards = [
    { day: 1, reward: { gold: 50, type: 'gold' }, icon: '💰' },
    { day: 2, reward: { gold: 100, type: 'gold' }, icon: '💰' },
    { day: 3, reward: { gems: 10, type: 'gems' }, icon: '💎' },
    { day: 4, reward: { gold: 150, type: 'gold' }, icon: '💰' },
    { day: 5, reward: { card: 'common', type: 'card' }, icon: '🃏' },
    { day: 6, reward: { gold: 200, type: 'gold' }, icon: '💰' },
    { day: 7, reward: { gems: 25, card: 'rare', type: 'premium' }, icon: '🎁' },
  ];

  const getCurrentStreak = () => {
    return rewardData?.streak || 0;
  };

  const getCurrentDay = () => {
    const streak = getCurrentStreak();
    return (streak % 7) + 1;
  };

  if (loading) {
    return (
      <div className="daily-reward-screen">
        <BackButton />
        <ResourceBar />
        <div className="daily-reward-loading">
          <div className="loading-spinner">🎁</div>
          <p>Загрузка ежедневных наград...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-reward-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="daily-reward-content">
        <div className="reward-header">
          <h2>🎁 Ежедневные Награды</h2>
          <p>Заходите каждый день для получения бонусов!</p>
        </div>

        <div className="streak-info">
          <div className="streak-count">
            <span className="streak-number">{getCurrentStreak()}</span>
            <span className="streak-label">дней подряд</span>
          </div>
          <div className="streak-bonus">
            +{Math.floor(getCurrentStreak() / 7) * 10}% к наградам
          </div>
        </div>

        <div className="rewards-calendar">
          {dailyRewards.map((dayReward, index) => {
            const isCurrent = getCurrentDay() === dayReward.day;
            const isClaimed = getCurrentStreak() >= dayReward.day;
            const isAvailable = isCurrent && canClaim;
            
            return (
              <div
                key={dayReward.day}
                className={`reward-day ${isCurrent ? 'current' : ''} ${isClaimed ? 'claimed' : ''} ${isAvailable ? 'available' : ''}`}
              >
                <div className="day-number">День {dayReward.day}</div>
                <div className="reward-icon">{dayReward.icon}</div>
                <div className="reward-amount">
                  {dayReward.reward.gold && `💰 ${dayReward.reward.gold}`}
                  {dayReward.reward.gems && `💎 ${dayReward.reward.gems}`}
                  {dayReward.reward.card && `🃏 ${dayReward.reward.card}`}
                </div>
                {isCurrent && (
                  <div className="day-indicator">
                    {isClaimed ? '🎉 Получено' : 'Сегодня'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="claim-section">
          {canClaim ? (
            <button
              className="claim-button"
              onClick={handleClaimReward}
              disabled={claiming}
            >
              {claiming ? 'Получаем награду...' : 'Получить награду'}
            </button>
          ) : (
            <div className="next-reward">
              <p>Следующая награда будет доступна:</p>
              <p className="next-time">
                {rewardData?.nextAvailableAt ? 
                  new Date(rewardData.nextAvailableAt).toLocaleString('ru-RU') : 
                  'Завтра'}
              </p>
            </div>
          )}
        </div>

        <div className="reward-tips">
          <h4>💡 Советы:</h4>
          <ul>
            <li>Не пропускайте дни для получения бонусов за серию</li>
            <li>Каждая неделя приносит особые награды</li>
            <li>7-й день - специальный сундук с редкими картами</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyReward;
