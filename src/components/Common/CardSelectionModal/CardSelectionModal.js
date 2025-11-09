// components/Common/CardSelectionModal/CardSelectionModal.js
import React, { useState } from 'react';
import './CardSelectionModal.css';

const CardSelectionModal = ({ 
  isOpen, 
  onClose, 
  onBattleStart, 
  userCards,
  level 
}) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 8;

  if (!isOpen) return null;

  // Заглушки для изображений (в будущем заменить на реальные)
  const enemyImages = [
    '🐉', '🧙', '⚔️', '🛡️', '🔥'
  ];

  const rewardImages = [
    '💰', '⚡', '🛡️', '⚔️', '❤️'
  ];

  // Заглушки для карточек пользователя (если нет реальных)
  const defaultCards = userCards.length > 0 ? userCards : Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Карточка ${i + 1}`,
    type: 'warrior',
    level: Math.floor(i / 5) + 1,
    attack: 10 + i,
    health: 50 + i * 2,
    image: ['⚔️', '🛡️', '🔥', '❄️', '⚡'][i % 5]
  }));

  const totalPages = Math.ceil(defaultCards.length / cardsPerPage);
  const currentCards = defaultCards.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const handleCardClick = (card) => {
    if (selectedCards.find(c => c.id === card.id)) {
      // Удаляем карточку если уже выбрана
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < 5) {
      // Добавляем карточку если меньше 5
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleStartBattle = () => {
    if (selectedCards.length === 5) {
      onBattleStart(selectedCards);
      onClose();
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card-selection-modal-overlay">
      <div className="card-selection-modal">
        
        {/* Шапка модального окна */}
        <div className="modal-header">
          <h2>Подготовка к битве</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          
          {/* Верхняя часть: противники */}
          <div className="enemies-section">
            <h3>Противники</h3>
            <div className="enemies-grid">
              {enemyImages.map((enemy, index) => (
                <div key={index} className="enemy-item">
                  <div className="enemy-icon">{enemy}</div>
                  <div className="enemy-level">Ур. {level + index}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Средняя часть: возможные награды */}
          <div className="rewards-section">
            <h3>Возможные награды</h3>
            <div className="rewards-grid">
              {rewardImages.map((reward, index) => (
                <div key={index} className="reward-item">
                  <div className="reward-icon">{reward}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Нижняя часть: выбор карточек */}
          <div className="cards-section">
            
            {/* Выбранные карточки (5 слотов) */}
            <div className="selected-cards">
              <h3>Выбранные карточки ({selectedCards.length}/5)</h3>
              <div className="card-slots">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className={`card-slot ${selectedCards[index] ? 'filled' : 'empty'}`}>
                    {selectedCards[index] ? (
                      <div 
                        className="selected-card"
                        onClick={() => handleCardClick(selectedCards[index])}
                      >
                        <div className="card-icon">{selectedCards[index].image}</div>
                        <div className="card-level">Ур. {selectedCards[index].level}</div>
                      </div>
                    ) : (
                      <div className="empty-slot">+</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Все карточки пользователя с пагинацией */}
            <div className="all-cards">
              <div className="cards-header">
                <h3>Ваши карточки</h3>
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 0}>←</button>
                  <span>Страница {currentPage + 1} из {totalPages}</span>
                  <button onClick={nextPage} disabled={currentPage === totalPages - 1}>→</button>
                </div>
              </div>
              
              <div className="cards-grid">
                {currentCards.map(card => (
                  <div
                    key={card.id}
                    className={`card-item ${selectedCards.find(c => c.id === card.id) ? 'selected' : ''}`}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="card-icon">{card.image}</div>
                    <div className="card-info">
                      <div className="card-name">{card.name}</div>
                      <div className="card-stats">
                        <span>⚔️ {card.attack}</span>
                        <span>❤️ {card.health}</span>
                      </div>
                      <div className="card-level">Ур. {card.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Футер с кнопкой "В бой" */}
        <div className="modal-footer">
          <button 
            className={`battle-button ${selectedCards.length === 5 ? 'active' : 'disabled'}`}
            onClick={handleStartBattle}
            disabled={selectedCards.length !== 5}
          >
            ⚔️ В БОЙ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionModal;
