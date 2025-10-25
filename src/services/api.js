import axios from 'axios'

const API_BASE_URL = 'http://localhost:8100/api'

// Загрузка реальных данных с бэкенда
export const loadGameData = async () => {
  try {
    // Временная заглушка - всегда возвращаем null чтобы использовать мок данные
    return null
    
    // Раскомментируйте когда бэкенд будет готов:
    /*
    const response = await axios.post(`${API_BASE_URL}/game-data`, {
      telegramId: 1 // Временный ID для разработки
    })
    return response.data
    */
  } catch (error) {
    console.error('Error loading game data:', error)
    return null
  }
}

// Мок данные для разработки
export const loadMockData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: 1,
          level: 5,
          gold: 1500,
          gems: 25,
          experience: 1200,
          maxExperience: 2000,
          heroCount: 5
        },
        heroes: [
          {
            id: 1,
            name: "Стальной Рыцарь",
            level: 3,
            health: 150,
            attack: 25,
            defense: 15,
            speed: 8,
            criticalChance: 0.15,
            criticalDamage: 1.8,
            element: "fire"
          },
          {
            id: 2,
            name: "Лесной Лучник",
            level: 2,
            health: 90,
            attack: 35,
            defense: 8,
            speed: 12,
            criticalChance: 0.25,
            criticalDamage: 2.2,
            element: "nature"
          },
          {
            id: 3,
            name: "Маг Огня",
            level: 4,
            health: 80,
            attack: 45,
            defense: 5,
            speed: 10,
            criticalChance: 0.20,
            criticalDamage: 2.5,
            element: "fire"
          },
          {
            id: 4,
            name: "Морская Волна",
            level: 3,
            health: 110,
            attack: 30,
            defense: 12,
            speed: 9,
            criticalChance: 0.18,
            criticalDamage: 2.0,
            element: "water"
          },
          {
            id: 5,
            name: "Горный Гигант",
            level: 5,
            health: 200,
            attack: 20,
            defense: 25,
            speed: 5,
            criticalChance: 0.10,
            criticalDamage: 1.5,
            element: "earth"
          }
        ]
      })
    }, 500)
  })
}
