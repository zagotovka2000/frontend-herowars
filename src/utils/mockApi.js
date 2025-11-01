// utils/mockApi.js
// Временные заглушки для API endpoints

export const mockApi = {
   // Битва 5x5
   async battle() {
     console.log('API: Starting battle...');
     return new Promise((resolve) => {
       setTimeout(() => {
         resolve({
           success: true,
           battleId: Math.random().toString(36).substr(2, 9),
           players: [],
           result: 'victory',
           rewards: { gold: 100, exp: 50 }
         });
       }, 1000);
     });
   },
 
   // Кампания
   async campaign(levelId) {
     console.log(`API: Starting campaign level ${levelId}...`);
     return new Promise((resolve) => {
       setTimeout(() => {
         resolve({
           success: true,
           rewards: {
             gold: 50,
             exp: 25,
             items: ['Малое зелье здоровья'],
             cardProgress: 0.1
           }
         });
       }, 800);
     });
   },
 
   // Магазин
   async shop() {
     console.log('API: Loading shop...');
     return new Promise((resolve) => {
       setTimeout(() => {
         resolve({
           success: true,
           items: [
             { id: 1, name: 'Редкая карта', price: 1000, type: 'card' },
             { id: 2, name: 'Зелье опыта', price: 100, type: 'potion' }
           ]
         });
       }, 500);
     });
   },
 
   // Экспедиции
   async expedition(startExpedition = false) {
     if (startExpedition) {
       console.log('API: Starting expedition...');
       return new Promise((resolve) => {
         setTimeout(() => {
           resolve({
             success: true,
             expeditionId: Math.random().toString(36).substr(2, 9),
             duration: 900000, // 15 минут в миллисекундах
             completionTime: Date.now() + 900000
           });
         }, 600);
       });
     }
     
     console.log('API: Loading expeditions...');
     return new Promise((resolve) => {
       setTimeout(() => {
         resolve({
           success: true,
           availableExpeditions: [
             { id: 1, name: 'Короткий поход', duration: 900000, rewards: { gold: 50 } },
             { id: 2, name: 'Средняя экспедиция', duration: 3600000, rewards: { gold: 200 } },
             { id: 3, name: 'Долгое путешествие', duration: 10800000, rewards: { gold: 500, items: ['Редкий артефакт'] } }
           ]
         });
       }, 500);
     });
   }
 };
