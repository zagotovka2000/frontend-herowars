// src/components/ItemSlot/ItemSlot.js
import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { navigateTo } from '../../store/slices/navigationSlice';
import './ItemSlot.css';

const ItemSlot = ({ 
  item, 
  slotIndex, 
  cardId, 
  isEquipped = false,
  onItemEquip,
  onItemUnequip 
}) => {
  const dispatch = useAppDispatch();
  const [showTooltip, setShowTooltip] = useState(false);

  // Обработчик клика по предмету
  const handleItemClick = () => {
    if (item && isEquipped) {
      // Если предмет установлен - показываем информацию или снимаем
      if (onItemUnequip) {
        onItemUnequip(cardId, slotIndex, item);
      }
    } else if (!item) {
      // Если ячейка пустая - переходим в кампанию для фарма
      dispatch(navigateTo('campaign'));
    }
  };

  // Получение класса для предмета в зависимости от состояния
  const getItemClass = () => {
    let className = 'item-slot';
    if (!item) {
      className += ' empty';
    } else if (isEquipped) {
      className += ' equipped';
    } else {
      className += ' unequipped';
    }
    return className;
  };

  // Получение пути к изображению
  const getItemImage = () => {
    if (!item) return null;
    
    // Базовый путь к изображению
    let imagePath = item.imageUrl;
    
    // Если предмет не установлен, используем серую версию
    if (!isEquipped) {
      imagePath = imagePath.replace('.png', '_gray.png');
    }
    
    return imagePath;
  };

  return (
    <div 
      className={getItemClass()}
      onClick={handleItemClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Основное изображение предмета */}
      {item ? (
        <div className="item-image-container">
          <img 
            src={getItemImage()} 
            alt={item.name}
            className="item-image"
            onError={(e) => {
              // Fallback если изображение не найдено
              e.target.src = `/images/items/${item.color}/default.png`;
            }}
          />
          
          {/* Индикатор ранга/цвета */}
          <div className={`item-color-indicator ${item.color}`}></div>
        </div>
      ) : (
        <div className="empty-slot-content">
          <div className="empty-slot-icon">+</div>
          <div className="empty-slot-text">Добавить</div>
        </div>
      )}

      {/* Тултип с информацией о предмете */}
      {showTooltip && item && (
        <div className="item-tooltip">
          <div className="item-tooltip-header">
            <span className={`item-name ${item.color}`}>{item.name}</span>
          </div>
          <div className="item-tooltip-body">
            <p className="item-description">{item.description}</p>
            
            {/* Бонусы характеристик */}
            {item.statBonus && Object.keys(item.statBonus).length > 0 && (
              <div className="item-stats">
                {Object.entries(item.statBonus).map(([stat, value]) => (
                  <div key={stat} className="stat-row">
                    <span className="stat-name">{getStatName(stat)}:</span>
                    <span className="stat-value">+{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Требования */}
            <div className="item-requirements">
              <div className="requirement">Требуемый ранг: {item.requiredRank}</div>
              {item.targetColor !== 'gray' && (
                <div className="requirement">Для: {getColorName(item.targetColor)}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательные функции
function getStatName(stat) {
  const statNames = {
    'attack': '⚔️ Атака',
    'defense': '🛡️ Защита',
    'health': '❤️ Здоровье',
    'mana': '🔮 Мана',
    'strength': '💪 Сила',
    'intelligence': '🧠 Интеллект',
    'speed': '⚡ Скорость',
    'critical': '🎯 Крит. удар',
    'heal': '💊 Лечение',
    'fireDamage': '🔥 Урон огня',
    'holyResistance': '✨ Сопр. свету'
  };
  return statNames[stat] || stat;
}

function getColorName(color) {
  const colorNames = {
    'gray': 'Серый',
    'green': 'Зеленый',
    'blue': 'Синий',
    'orange': 'Оранжевый',
    'red': 'Красный'
  };
  return colorNames[color] || color;
}

export default ItemSlot;
