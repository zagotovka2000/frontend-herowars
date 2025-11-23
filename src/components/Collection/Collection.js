// src/components/Collection/Collection.js
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import CardDetails from '../CardDetails/CardDetails';
import './Collection.css';

const Collection = () => {
  const dispatch = useAppDispatch();
  const { loadUserCards } = useApi();
  const user = useAppSelector(state => state.app.user);
  const cards = useAppSelector(state => state.app.cards);
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка карточек при монтировании компонента
  useEffect(() => {
    const loadCards = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          await loadUserCards(user.id);
        } catch (error) {
          console.error('Ошибка загрузки карточек:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCards();
  }, [user, loadUserCards]);

  // Установка первой карточки по умолчанию при загрузке
  useEffect(() => {
    if (cards && cards.length > 0 && !selectedCard) {
      setSelectedCard(cards[0]);
    }
  }, [cards, selectedCard]);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  // Рассчитываем общую мощь карт
  const totalPower = cards?.reduce((sum, card) => sum + (card.baseAttack || card.value || 0), 0) || 0;

  // Отображение загрузки
  if (loading) {
    return (
      <div className="collection-screen">
        <BackButton />
        <ResourceBar />
        <div className="collection-loading">
          <div className="loading-spinner">🃏</div>
          <p>Загрузка коллекции...</p>
        </div>
      </div>
    );
  }

  // ✅ Защита от пустой коллекции
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
          <div className="stat-item">Уровень: {user?.level || 1}</div>
        </div>
      </div>

      {/* Основной контейнер с двумя колонками */}
      <div className="collection-container">
        {/* Левая колонка - список карточек */}
        <div className="cards-column">
          <h3>Ваши карты</h3>
          <div className="cards-grid">
            {cards.map(card => (
              <div 
                key={card.id} 
                className={`collection-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                onClick={() => handleCardSelect(card)}
              >
                <div className={`card-frame frame-${card.color || 'gray'}`}>
                  <div className="card-image">
                    {card.image || '🃏'}
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-name">{card.name || `Карта ${card.id}`}</div>
                  <div className="card-meta">
                    <span className="card-level">Ур. {card.level || 1}</span>
                    <span className={`card-rarity ${card.color || 'gray'}`}>
                      {getRarityName(card.color)}
                    </span>
                  </div>
                  <div className="card-stats">
                    <span title="Атака">⚔️ {card.baseAttack || card.value || 0}</span>
                    <span title="Здоровье">❤️ {card.baseHealth || card.health || 10}</span>
                    <span title="Броня">🛡️ {card.baseArmor || 0}</span>
                  </div>
                  {card.isInDeck && <div className="in-deck-badge">В колоде</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка - детали выбранной карточки */}
        <div className="details-column">
          {selectedCard ? (
            <CardDetails 
              card={selectedCard} 
              onBack={null} // Убираем кнопку назад в двухколоночном layout
              showBackButton={false}
            />
          ) : (
            <div className="no-card-selected">
              <div className="no-card-icon">🎯</div>
              <h3>Выберите карту</h3>
              <p>Выберите карту из коллекции для просмотра деталей и управления предметами</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для получения названия редкости
function getRarityName(color) {
  const rarityNames = {
    'gray': 'Обычная',
    'green': 'Необычная',
    'blue': 'Редкая',
    'orange': 'Эпическая',
    'red': 'Легендарная'
  };
  return rarityNames[color] || 'Обычная';
}

export default Collection;
