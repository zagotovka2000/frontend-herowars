// src/components/Collection/Collection.js
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import './Collection.css';

const Collection = () => {
  // Получаем карты пользователя из Redux store
  const cards = useAppSelector(state => state.app.cards);

  // ✅ ИСПРАВЛЕНО: защита от пустой коллекции
  if (!cards || cards.length === 0) {
    return (
      <div className="collection-screen">
        <BackButton />
        <ResourceBar />
        <div className="collection-empty">
          <div className="empty-icon">🃏</div>
          <h2>Коллекция карт пуста</h2>
          <p>Получайте карты в кампаниях и магазине!</p>
        </div>
      </div>
    );
  }

  // Рассчитываем общую мощь карт
  const totalPower = cards.reduce((sum, card) => sum + (card.power || card.value || 0), 0);

  return (
    <div className="collection-screen">
      <BackButton />
      <ResourceBar />
      
      {/* Заголовок и статистика */}
      <div className="collection-header">
        <h2>🃏 Коллекция карт</h2>
        <div className="collection-stats">
          <div className="stat-item">Всего карт: {cards.length}</div>
          <div className="stat-item">Общая мощь: {totalPower}</div>
        </div>
      </div>

      {/* Сетка карт */}
      <div className="cards-grid">
        {cards.map(card => (
          <div key={card.id} className="collection-card">
            <div className="card-image">
              {card.image || '🃏'}
            </div>
            <div className="card-name">{card.name || `Карта ${card.id}`}</div>
            <div className="card-rarity">{card.rarity || 'Обычная'}</div>
            <div className="card-stats">
              <span>⚔️ {card.power || card.value || 0}</span>
              <span>❤️ {card.health || 10}</span>
            </div>
            <div className="card-level">Ур. {card.level || 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
