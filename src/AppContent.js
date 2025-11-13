// src/AppContent.js
import React, {useState,useEffect} from 'react';
import { useAppSelector,useAppDispatch } from './store/hooks';
import { selectCurrentScreen } from './store/slices/navigationSlice';
import MainMap from './components/MainMap/MainMap';
import Campaign from './components/Campaign/Campaign';
import Arena from './components/Arena/Arena';
import Collection from './components/Collection/Collection';
import Shop from './components/Shop/Shop';
import Quests from './components/Quests/Quests';
import GuildWar from './components/GuildWar/GuildWar';
import DailyReward from './components/DailyReward/DailyReward';
import FreeChest from './components/FreeChest/FreeChest';
import Expedition from './components/Expedition/Expedition';
import './App.css'
import { fetchUser,fetchCampaigns } from './store/slices/apiSlice';

function AppContent() {
   const dispatch = useAppDispatch();
   const currentScreen = useAppSelector(selectCurrentScreen);
   const user = useAppSelector(state => state.app.user);
   const apiLoading = useAppSelector(state => state.api.loading);
   const apiError = useAppSelector(state => state.api.error);
   const [initialLoad, setInitialLoad] = useState(true);
   console.log('Текущий экран:', currentScreen);

   // Загружаем пользователя при монтировании компонента
   useEffect(() => {
      const loadUser = async () => {
         try {
           await dispatch(fetchUser('987654321')).unwrap();
         } catch (error) {
           console.error('❌ Ошибка инициализации приложения:', error);
         } finally {
           setInitialLoad(false);
         }
       };

   if (!user) {
     loadUser();
   } else {
     setInitialLoad(false);
   }
 }, [dispatch, user]); 

  // Загружаем кампании после загрузки пользователя
  useEffect(() => {
   if (user && user.id && !initialLoad) {
     dispatch(fetchCampaigns(user.id));
   }
 }, [user, initialLoad, dispatch]);

 const renderScreen = () => {
   switch (currentScreen) {
     case 'campaign': return <Campaign user={user}/>;
     case 'arena': return <Arena />;
     case 'collection': return <Collection />;
     case 'shop': return <Shop />;
     case 'quests': return <Quests />;
     case 'guild-war': return <GuildWar />;
     case 'daily-reward': return <DailyReward />;
     case 'expedition': return <Expedition />;
     case 'free-chest': return <FreeChest />;
     default: return <MainMap />;
   }
 };

// Показываем загрузку при первоначальной инициализации
if (initialLoad) {
   return (
      <div className="app">
       <div className="app-loading">
         <div className="loading-spinner"></div>
         <div>Инициализация игры...</div>
       </div>
     </div>
   );
}

 // Показываем ошибку, если есть и пользователь не загружен
 if (apiError && !user) {
   return (
     <div className="app">
       <div className="app-error">
         <div className="error-icon">⚠️</div>
         <h3>Ошибка загрузки</h3>
         <p>{apiError}</p>
         <button onClick={() => window.location.reload()}>
           Перезагрузить
         </button>
       </div>
     </div>
   );
 }

 // Показываем загрузку, если данные еще грузятся и пользователь не загружен
 if (apiLoading && !user) {
   return (
     <div className="app">
       <div className="app-loading">
         <div className="loading-spinner"></div>
         <div>Загрузка данных игрока...</div>
       </div>
     </div>
   );
 }

  return (
    <div className="app">
      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
}

export default AppContent;
