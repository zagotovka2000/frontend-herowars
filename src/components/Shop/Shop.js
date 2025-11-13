// src/components/Shop/Shop.js
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import { addGold, addGems } from '../../store/slices/appSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import LoadingState from '../Common/LoadingState';
import './Shop.css';

const Shop = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app);
  const { getShopItems, purchaseItem } = useApi();
  
  // Состояния компонента
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('cards');

  // Эффект для загрузки товаров при монтировании
  useEffect(() => {
    loadItems();
  }, []);

  // Функция загрузки товаров
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const shopItems = await getShopItems();
      setItems(shopItems);
    } catch (err) {
      console.error('Ошибка загрузки магазина:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  // Функция покупки товара
  const onPurchase = async (item) => {
    if (!user) return;
    
    try {
      setPurchasingItem(item.id);
      setError(null);
      
      const purchaseData = {
        userId: user.id,
        itemId: item.id,
        quantity: 1
      };

      const result = await purchaseItem(purchaseData);
      
      if (result.success) {
        // Обновляем локальное состояние
        if (item.currency === 'gold') {
          dispatch(addGold(-item.price));
        } else if (item.currency === 'gems') {
          dispatch(addGems(-item.price));
        }
        
        // Можно показать уведомление об успешной покупке
        console.log(`Покупка успешна! Вы получили: ${item.name}`);
      }
    } catch (error) {
      console.error('Ошибка покупки:', error);
      setError('Ошибка при покупке товара');
    } finally {
      setPurchasingItem(null);
    }
  };

  // Проверка возможности покупки товара
  const canAfford = (item) => {
    if (!user) return false;
    
    if (item.currency === 'gold') {
      return user.gold >= item.price;
    } else if (item.currency === 'gems') {
      return user.gems >= item.price;
    }
    return false;
  };

  // Фильтрация товаров по категориям
  const filteredItems = items.filter(item => 
    item.category === activeCategory || !item.category
  );

  // Категории магазина
  const categories = [
    { id: 'cards', name: 'Карты', icon: '🃏' },
    { id: 'boosters', name: 'Усиления', icon: '⚡' },
    { id: 'resources', name: 'Ресурсы', icon: '💰' },
    { id: 'special', name: 'Особое', icon: '🎁' }
  ];

  // Отображение загрузки
  if (loading) {
    return (
      <div className="shop-screen">
        <BackButton />
        <ResourceBar />
        <LoadingState message="Загрузка магазина..." />
      </div>
    );
  }

  return (
    <div className="shop-screen">
      <BackButton />
      <ResourceBar />
      
      {/* Заголовок магазина */}
      <div className="shop-header">
        <h2>🏪 Магазин</h2>
        <p>Улучшайте своих героев и получайте преимущества!</p>
      </div>

      {/* Ошибка загрузки */}
      {error && (
        <div className="shop-error">
          <div className="error-message">
            <div className="error-icon">❌</div>
            <p>{error}</p>
            <button onClick={loadItems}>Попробовать снова</button>
          </div>
        </div>
      )}

      {/* Категории товаров */}
      <div className="shop-categories">
        {categories.map(category => (
          <button 
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      <div className="shop-items-grid">
        {filteredItems.map(item => {
          const affordable = canAfford(item);
          const isPurchasing = purchasingItem === item.id;
          
          return (
            <div key={item.id} className={`shop-item ${!affordable ? 'unaffordable' : ''}`}>
              <div className="item-icon">
                {item.icon || '🎁'}
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                
                <div className="item-price">
                  {item.currency === 'gold' ? '💰' : '💎'} {item.price}
                </div>
                
                <div className="item-stats">
                  {item.bonus && <span>+{item.bonus} ⚔️</span>}
                  {item.duration && <span>⏱️ {item.duration}ч</span>}
                  {item.quantity && <span>📦 {item.quantity} шт</span>}
                </div>
              </div>
              
              <button
                className={`purchase-btn ${!affordable ? 'disabled' : ''}`}
                onClick={() => onPurchase(item)}
                disabled={!affordable || isPurchasing}
              >
                {isPurchasing ? 'Покупка...' : affordable ? 'Купить' : 'Недостаточно'}
              </button>
            </div>
          );
        })}
        
        {/* Сообщение если товаров нет */}
        {filteredItems.length === 0 && !loading && (
          <div className="no-items">
            <div className="no-items-icon">🛒</div>
            <p>Товары в этой категории временно отсутствуют</p>
            <p>Загляните позже или проверьте другие категории!</p>
          </div>
        )}
      </div>

      {/* Специальные предложения */}
      <div className="shop-specials">
        <h3>⚡ Специальные предложения</h3>
        <div className="special-offers">
          <div className="special-offer">
            <div className="offer-badge">ХИТ</div>
            <div className="offer-content">
              <h4>Набор новичка</h4>
              <p>5 карт + 1000 золота</p>
              <div className="offer-price">
                <span className="old-price">💎 199</span>
                <span className="new-price">💎 99</span>
              </div>
            </div>
          </div>
          
          <div className="special-offer">
            <div className="offer-badge">-50%</div>
            <div className="offer-content">
              <h4>Энергетический запас</h4>
              <p>+100 энергии сразу</p>
              <div className="offer-price">
                <span className="old-price">💎 149</span>
                <span className="new-price">💎 74</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ДОБАВЛЕНО: информация о валюте */}
      <div className="currency-info">
        <p>💡 Золото можно заработать в кампаниях, а самоцветы - за достижения и покупки</p>
      </div>
    </div>
  );
};

export default Shop;
