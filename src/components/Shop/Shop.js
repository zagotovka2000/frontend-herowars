import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import { useAsync } from '../../hooks/useAsync';
import { addGold, addGems } from '../../store/slices/appSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import LoadingState from '../Common/LoadingState';
import ErrorState from '../Common/ErrorState';

const Shop = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.app);
  const { getShopItems, purchaseItem } = useApi();
  
  const { 
    execute: loadItems, 
    loading: itemsLoading, 
    error: itemsError, 
    data: items = [] 
  } = useAsync(getShopItems);
  
  const { 
    execute: handlePurchase, 
    loading: purchasing, 
    error: purchaseError 
  } = useAsync(purchaseItem);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onPurchase = async (item) => {
    if (!user) return;
    
    try {
      const purchaseData = {
        userId: user.id,
        itemId: item.id,
        quantity: 1
      };

      const result = await handlePurchase(purchaseData);
      
      if (result.success) {
        // Обновляем локальное состояние
        if (item.currency === 'gold') {
          dispatch(addGold(-item.price));
        } else if (item.currency === 'gems') {
          dispatch(addGems(-item.price));
        }
        
        alert(`Покупка успешна! Вы получили: ${item.name}`);
      }
    } catch (error) {
      console.error('Ошибка покупки:', error);
      // Ошибка уже обработана в useAsync
    }
  };

  const canAfford = (item) => {
    if (!user) return false;
    
    if (item.currency === 'gold') {
      return user.gold >= item.price;
    } else if (item.currency === 'gems') {
      return user.gems >= item.price;
    }
    return false;
  };

  if (itemsLoading) {
    return (
      <div className="shop-screen">
        <BackButton />
        <ResourceBar />
        <LoadingState message="Загрузка магазина..." />
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="shop-screen">
        <BackButton />
        <ResourceBar />
        <ErrorState error={itemsError.message || "Ошибка загрузки магазина"} onRetry={loadItems} />
      </div>
    );
  }

  return (
    <div className="shop-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="shop-header">
        <h2>🏪 Магазин</h2>
        <p>Улучшайте своих героев и получайте преимущества!</p>
      </div>

      {purchaseError && (
        <div className="shop-error">
          <ErrorState error={purchaseError.message || "Ошибка покупки"} />
        </div>
      )}

      <div className="shop-categories">
        <button className="category-btn active">Карты</button>
        <button className="category-btn">Усиления</button>
        <button className="category-btn">Ресурсы</button>
        <button className="category-btn">Особое</button>
      </div>

      <div className="shop-items-grid">
        {items.map(item => {
          const affordable = canAfford(item);
          const isPurchasing = purchasing;
          
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
        
        {items.length === 0 && !itemsLoading && (
          <div className="no-items">
            <p>🎁 Товары временно отсутствуют</p>
            <p>Загляните позже!</p>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Shop;
