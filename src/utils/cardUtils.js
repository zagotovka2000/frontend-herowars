export const generateCards = (count, config) => {
   const cards = [];
   for (let i = 0; i < count; i++) {
     cards.push({
       id: i,
       value: Math.floor(Math.random() * (config.maxCardValue - config.minCardValue + 1)) + config.minCardValue,
       health: 10,
       maxHealth: 10
     });
   }
   return cards;
 };
 
 export const calculateDamage = (attackerValue) => {
   return Math.max(1, attackerValue - Math.floor(Math.random() * 3));
 };
