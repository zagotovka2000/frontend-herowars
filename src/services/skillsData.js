export const heroSkills = {
   1: [ // Стальной Рыцарь
     { id: 1, name: "Меч Света", damage: 35, manaCost: 20, type: "attack", effect: "burn" },
     { id: 2, name: "Щит Веры", damage: 0, heal: 25, manaCost: 15, type: "heal" }
   ],
   2: [ // Лесной Лучник
     { id: 3, name: "Стрела Ветра", damage: 40, manaCost: 25, type: "attack", effect: "stun" },
     { id: 4, name: "Природа Исцеляет", damage: 0, heal: 30, manaCost: 20, type: "heal" }
   ],
   // ... добавьте навыки для других героев
 }
 
 export const skillEffects = {
   burn: { damage: 5, duration: 3, type: "damage_over_time" },
   stun: { duration: 1, type: "stun" },
   poison: { damage: 3, duration: 4, type: "damage_over_time" }
 }
