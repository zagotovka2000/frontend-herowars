// src/components/CardDetails/CardDetails.js
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import ItemSlot from '../ItemSlot/ItemSlot';
import './CardDetails.css';

const CardDetails = ({ card, onBack, showBackButton = true }) => {
  const dispatch = useAppDispatch();
  const { saveUser } = useApi();
  const user = useAppSelector(state => state.app.user);
  
  const [equippedItems, setEquippedItems] = useState([]);
  const [canUpgrade, setCanUpgrade] = useState(false);

  // Загрузка экипированных предметов при монтировании
  useEffect(() => {
    if (card && card.equippedItems) {
      setEquippedItems(card.equippedItems);
    } else {
      // Инициализация пустыми слотами
      setEquippedItems(Array(6).fill(null));
    }
  }, [card]);

  // Проверка возможности повышения ранга
  useEffect(() => {
    const allSlotsFilled = equippedItems.every(item => item !== null);
    setCanUpgrade(allSlotsFilled);
  }, [equippedItems]);

  // Обработчик экипировки предмета
  const handleItemEquip = (item, slotIndex) => {
    const newEquippedItems = [...equippedItems];
    newEquippedItems[slotIndex] = item;
    setEquippedItems(newEquippedItems);
    
    // Сохранение на сервер
    updateCardOnServer(newEquippedItems);
  };

  // Обработчик снятия предмета
  const handleItemUnequip = (cardId, slotIndex, item) => {
    const newEquippedItems = [...equippedItems];
    newEquippedItems[slotIndex] = null;
    setEquippedItems(newEquippedItems);
    
    // Сохранение на сервер
    updateCardOnServer(newEquippedItems);
    
    // TODO: Добавить предмет обратно в инвентарь
    console.log('Предмет снят:', item);
  };

  // Обновление карточки на сервере
  const updateCardOnServer = async (items) => {
    try {
      // Здесь должен быть API вызов для обновления карточки
      console.log('Обновление карточки:', { cardId: card.id, equippedItems: items });
      
      // Временная имитация API вызова
      // await updateCard({ cardId: card.id, equippedItems: items });
    } catch (error) {
      console.error('Ошибка обновления карточки:', error);
    }
  };

  // Обработчик повышения ранга
  const handleUpgradeRank = async () => {
    if (!canUpgrade) return;

    try {
      // TODO: Реализовать логику повышения ранга
      console.log('Повышение ранга карточки:', card.id);
      
      // Сброс экипированных предметов после повышения
      setEquippedItems(Array(6).fill(null));
      
      // Показать сообщение об успехе
      alert(`Ранг карточки "${card.name}" повышен!`);
      
    } catch (error) {
      console.error('Ошибка повышения ранга:', error);
    }
  };

  // Расчет суммарных бонусов от предметов
  const calculateTotalBonuses = () => {
    const bonuses = {};
    
    equippedItems.forEach(item => {
      if (item && item.statBonus) {
        Object.entries(item.statBonus).forEach(([stat, value]) => {
          bonuses[stat] = (bonuses[stat] || 0) + value;
        });
      }
    });
    
    return bonuses;
  };

  const totalBonuses = calculateTotalBonuses();

  if (!card) {
    return (
      <div className="card-details">
        <div className="card-details-error">
          <p>Карточка не найдена</p>
          {showBackButton && onBack && (
            <button onClick={onBack}>Назад</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card-details">
      {/* Заголовок с кнопкой назад (только если нужно) */}
      {showBackButton && onBack && (
        <div className="card-details-header">
          <button className="back-button" onClick={onBack}>← Назад</button>
          <h2>{card.name}</h2>
          <div className="card-rank">Ранг: {card.rank || 1}</div>
        </div>
      )}

      {/* Заголовок без кнопки назад для двухколоночного режима */}
      {!showBackButton && (
        <div className="card-details-header compact">
          <h2>{card.name}</h2>
          <div className="card-rank">Ранг: {card.rank || 1}</div>
        </div>
      )}

      {/* Основная информация о карточке */}
      <div className="card-main-info compact">
        <div className="card-image-section">
          <div className={`card-image frame-${card.color || 'gray'}`}>
            <div className="card-placeholder">{card.name.charAt(0)}</div>
          </div>
          <div className="card-level">Уровень: {card.level || 1}</div>
        </div>

        <div className="card-stats">
          <h3>Характеристики</h3>
          <div className="stat-item">
            <span>⚔️ Атака:</span>
            <span>{card.baseAttack || card.value || 0}</span>
          </div>
          <div className="stat-item">
            <span>❤️ Здоровье:</span>
            <span>{card.baseHealth || card.health || 10}</span>
          </div>
          <div className="stat-item">
            <span>🛡️ Броня:</span>
            <span>{card.baseArmor || 0}</span>
          </div>
          <div className="stat-item">
            <span>🎯 Крит. шанс:</span>
            <span>{((card.baseCriticalChance || 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Бонусы от предметов */}
      {Object.keys(totalBonuses).length > 0 && (
        <div className="item-bonuses">
          <h3>Бонусы от предметов</h3>
          <div className="bonuses-grid">
            {Object.entries(totalBonuses).map(([stat, value]) => (
              <div key={stat} className="bonus-item">
                <span className="bonus-stat">{getStatName(stat)}:</span>
                <span className="bonus-value">+{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Слоты для предметов */}
      <div className="item-slots-section">
        <h3>Экипированные предметы</h3>
        <div className="item-slots-grid">
          {equippedItems.map((item, index) => (
            <ItemSlot
              key={index}
              item={item}
              slotIndex={index}
              cardId={card.id}
              isEquipped={!!item}
              onItemEquip={handleItemEquip}
              onItemUnequip={handleItemUnequip}
            />
          ))}
        </div>
      </div>

      {/* Кнопка повышения ранга */}
      <div className="upgrade-section">
        <button 
          className={`upgrade-rank-button ${canUpgrade ? 'active' : 'disabled'}`}
          onClick={handleUpgradeRank}
          disabled={!canUpgrade}
        >
          {canUpgrade ? '🎯 Повысить ранг' : 'Заполните все слоты'}
        </button>
        <div className="upgrade-hint">
          {canUpgrade 
            ? 'Все предметы установлены! Вы можете повысить ранг карточки.'
            : `Установите предметы во все ${6 - equippedItems.filter(item => item).length} оставшихся слотов.`
          }
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция
function getStatName(stat) {
  const statNames = {
    'attack': 'Атака',
    'defense': 'Защита',
    'health': 'Здоровье',
    'mana': 'Мана',
    'strength': 'Сила',
    'intelligence': 'Интеллект',
    'speed': 'Скорость',
    'critical': 'Крит. удар',
    'heal': 'Лечение'
  };
  return statNames[stat] || stat;
}

export default CardDetails;
