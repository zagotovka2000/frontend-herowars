// battleService.js
class BattleService {
   async startBattle(attackers, defenders) {
     try {
       console.log('Saving team:', attackers, defenders);
       
       // Имитация запроса к серверу
       const response = await fetch('http://localhost:8100/api/battle/start', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ attackers, defenders }),
       });
       
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       
       return await response.json();
     } catch (error) {
       console.log('Using mock battle service due to:', error.message);
       return this.getMockBattleData(attackers, defenders);
     }
   }
 
   getMockBattleData(attackers, defenders) {
     // Преобразуем ID в объекты юнитов
     const attackerUnits = attackers.map((id, index) => ({
       id: `attacker_${id}_${index}`,
       name: `Атакующий ${index + 1}`,
       health: 100,
       maxHealth: 100,
       attack: Math.floor(Math.random() * 20) + 10,
       defense: Math.floor(Math.random() * 10) + 5,
       type: ['Warrior', 'Archer', 'Mage'][index % 3]
     }));
 
     const defenderUnits = defenders.map((id, index) => ({
       id: `defender_${id}_${index}`,
       name: `Защитник ${index + 1}`,
       health: 100,
       maxHealth: 100,
       attack: Math.floor(Math.random() * 18) + 8,
       defense: Math.floor(Math.random() * 12) + 8,
       type: ['Warrior', 'Archer', 'Mage'][index % 3]
     }));
 
     return {
       attackers: attackerUnits,
       defenders: defenderUnits,
       currentTurn: attackerUnits[0].id, // ID первого атакующего
       battleStatus: 'active',
       turnNumber: 1
     };
   }
 
   async performAction(action) {
     try {
       const response = await fetch('http://localhost:8100/api/battle/action', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(action),
       });
       
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       
       return await response.json();
     } catch (error) {
       console.log('Using mock battle action service due to:', error.message);
       return this.getMockActionResult(action);
     }
   }
 
   getMockActionResult(action) {
     // Простая имитация результата действия
     return {
       success: true,
       damage: Math.floor(Math.random() * 20) + 5,
       nextTurn: action.targetType === 'defender' ? 'defender' : 'attacker'
     };
   }
 }
 
 export default new BattleService();
