import React from 'react';
import { useAppSelector } from '../../store/hooks';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';


const Collection = () => {
  const cards = useAppSelector(state => state.app.cards);

  return (
    <div className="collection-screen">
      <BackButton />
      <ResourceBar />
      <h2>🃏 Коллекция карт</h2>
      <div className="collection-stats">
        <div className="stat-item">Всего карт: {cards.length}</div>
        <div className="stat-item">
          Общая мощь: {cards.reduce((sum, card) => sum + card.power, 0)}
        </div>
      </div>
      <div className="cards-grid">
        {cards.map(card => (
          <div key={card.id} className="collection-card">
            <div className="card-name">{card.name}</div>
            <div className="card-rarity">{card.rarity}</div>
            <div className="card-stats">
              <span>⚔️ {card.power}</span>
              <span>❤️ {card.health}</span>
            </div>
            <div className="card-level">Ур. {card.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
