// Конфигурация
const API_BASE_URL = 'http://localhost:3000';
const USE_MOCK_DATA = true;

// Глобальные переменные
let userData = null;
let heroes = [];
let selectedTeam = [];
let tg = null;
let currentSlotPosition = null;

// Инициализация Telegram Web App
function initTelegramApp() {
    try {
        if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
            console.warn('Telegram Web App не доступен. Запуск в режиме браузера.');
            tg = {
                ready: () => {},
                expand: () => {},
                setHeaderColor: () => {},
                setBackgroundColor: () => {},
                initDataUnsafe: { 
                    user: { 
                        id: Math.floor(Math.random() * 100000), 
                        first_name: 'TestUser',
                        username: 'test_user'
                    } 
                },
                sendData: (data) => console.log('Send data:', data)
            };
        } else {
            tg = Telegram.WebApp;
            tg.ready();
            tg.expand();
            tg.setHeaderColor('#2c3e50');
            tg.setBackgroundColor('#667eea');
        }
        
        console.log('Приложение инициализировано');
        loadGameData();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        loadGameData();
    }
}

// Загрузка данных игры
async function loadGameData() {
    try {
        const tgUser = tg?.initDataUnsafe?.user;
        
        if (!tgUser || USE_MOCK_DATA) {
            await loadMockData();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/game-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                telegramId: tgUser?.id 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        userData = data.user;
        heroes = data.heroes || [];
        
        renderUserInfo();
        renderHeroes();
        renderTeamBuilder();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        await loadMockData();
    }
}

// Загрузка тестовых данных
async function loadMockData() {
    try {
        document.getElementById('user-info').innerHTML = '<div class="loading">Загрузка тестовых данных...</div>';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        userData = {
            id: 1,
            level: 5,
            gold: 1500,
            gems: 25,
            experience: 1200,
            maxExperience: 2000
        };
        
        heroes = [
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
        ];
        
        renderUserInfo();
        renderHeroes();
        renderTeamBuilder();
        
        console.log('Загружены тестовые данные');
    } catch (error) {
        console.error('Ошибка загрузки моковых данных:', error);
        document.getElementById('user-info').innerHTML = 
            '<div class="error">❌ Ошибка загрузки данных</div>';
    }
}

// Отображение информации о пользователе
function renderUserInfo() {
    if (!userData) return;
    
    const experiencePercent = (userData.experience / userData.maxExperience) * 100;
    
    document.getElementById('user-info').innerHTML = `
        <div class="stat">
            <div>🏆 Уровень</div>
            <div class="stat-value">${userData.level}</div>
        </div>
        <div class="stat">
            <div>💰 Золото</div>
            <div class="stat-value">${userData.gold}</div>
        </div>
        <div class="stat">
            <div>💎 Самоцветы</div>
            <div class="stat-value">${userData.gems}</div>
        </div>
        <div class="stat">
            <div>🎯 Героев</div>
            <div class="stat-value">${heroes.length}</div>
        </div>
    `;
}

// Отображение списка героев
function renderHeroes() {
    const container = document.getElementById('heroes-list');
    
    if (!heroes || heroes.length === 0) {
        container.innerHTML = '<div class="error">❌ У вас пока нет героев</div>';
        return;
    }

    container.innerHTML = heroes.map(hero => `
        <div class="hero-card">
            <h3>${hero.name} (Ур. ${hero.level})</h3>
            <div class="hero-stats">
                <div class="stat-item">❤️ Здоровье: ${hero.health}</div>
                <div class="stat-item">⚔️ Атака: ${hero.attack}</div>
                <div class="stat-item">🛡️ Защита: ${hero.defense}</div>
                <div class="stat-item">🏃 Скорость: ${hero.speed}</div>
                <div class="stat-item">🎯 Крит: ${(hero.criticalChance * 100).toFixed(1)}%</div>
                <div class="stat-item">💥 Урон крита: ${hero.criticalDamage.toFixed(1)}x</div>
            </div>
            <button class="upgrade-btn" 
                    onclick="upgradeHero(${hero.id})"
                    ${userData.gold < hero.level * 100 ? 'disabled' : ''}>
                🚀 Улучшить (${hero.level * 100} золота)
            </button>
        </div>
    `).join('');
}

// Отображение конструктора команды
function renderTeamBuilder() {
    const teamBuilder = document.getElementById('team-builder');
    if (!teamBuilder) return;
    
    teamBuilder.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const slot = document.createElement('div');
        slot.className = 'team-slot';
        slot.setAttribute('data-position', i);
        slot.innerHTML = `Позиция ${i}`;
        slot.onclick = () => selectHeroForSlot(i);
        teamBuilder.appendChild(slot);
    }
}

// Выбор героя для позиции в команде
function selectHeroForSlot(position) {
    currentSlotPosition = position;
    showHeroSelectionModal();
}

// Показать модальное окно выбора героя
function showHeroSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'hero-select-modal';
    modal.innerHTML = `
        <div class="hero-select-content">
            <h3>Выберите героя для позиции ${currentSlotPosition}</h3>
            <div id="hero-options">
                ${heroes.map(hero => `
                    <div class="hero-option" onclick="addHeroToTeam(${hero.id})">
                        <strong>${hero.name}</strong> (Ур. ${hero.level})<br>
                        <small>❤️ ${hero.health} | ⚔️ ${hero.attack} | 🛡️ ${hero.defense}</small>
                    </div>
                `).join('')}
            </div>
            <button class="close-modal" onclick="closeHeroSelectionModal()">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Закрыть модальное окно выбора героя
function closeHeroSelectionModal() {
    const modal = document.querySelector('.hero-select-modal');
    if (modal) {
        modal.remove();
    }
    currentSlotPosition = null;
}

// Добавить героя в команду
function addHeroToTeam(heroId) {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    
    selectedTeam[currentSlotPosition - 1] = heroId;
    
    const slot = document.querySelector(`[data-position="${currentSlotPosition}"]`);
    slot.innerHTML = `
        <strong>${hero.name}</strong><br>
        <small>Ур. ${hero.level}</small>
    `;
    slot.classList.add('filled');
    
    closeHeroSelectionModal();
    showMessage('Герой добавлен в команду!', 'success');
}

// Показать сообщение
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error' : 'success';
    messageDiv.textContent = text;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Переключение вкладок
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    event.target.classList.add('active');
}

// Улучшение героя
async function upgradeHero(heroId) {
    try {
        const hero = heroes.find(h => h.id === heroId);
        if (!hero) {
            showMessage('Герой не найден', 'error');
            return;
        }

        const upgradeCost = hero.level * 100;
        if (userData.gold < upgradeCost) {
            showMessage(`Недостаточно золота! Нужно: ${upgradeCost}`, 'error');
            return;
        }

        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'upgrade_hero',
                heroId: heroId,
                userId: userData.id
            }));
            showMessage('Запрос на улучшение отправлен!', 'success');
        } else {
            // Имитация улучшения для тестирования
            userData.gold -= upgradeCost;
            hero.level += 1;
            hero.health += 10;
            hero.attack += 5;
            hero.defense += 2;
            
            renderUserInfo();
            renderHeroes();
            showMessage(`${hero.name} улучшен до уровня ${hero.level}!`, 'success');
        }
        
    } catch (error) {
        console.error('Ошибка улучшения героя:', error);
        showMessage('Ошибка при улучшении героя: ' + error.message, 'error');
    }
}

// Сохранение команды
async function saveTeam() {
    try {
        const filledSlots = selectedTeam.filter(id => id !== undefined);
        
        if (filledSlots.length === 0) {
            showMessage('Добавьте хотя бы одного героя в команду!', 'error');
            return;
        }

        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'save_team',
                team: selectedTeam,
                userId: userData.id
            }));
            showMessage('Команда сохранена!', 'success');
        } else {
            // Имитация сохранения для тестирования
            showMessage('Команда успешно сохранена!', 'success');
        }
        
    } catch (error) {
        console.error('Ошибка сохранения команды:', error);
        showMessage('Ошибка при сохранении команды', 'error');
    }
}

// Поиск битвы
async function findBattle() {
    const battleResult = document.getElementById('battle-result');
    battleResult.innerHTML = '<div class="loading">🔍 Поиск противника...</div>';
    
    try {
        setTimeout(() => {
            battleResult.innerHTML = `
                <div class="error">
                    ⚠️ Функция битв через Web App в разработке.<br>
                    Используйте команду /battle в основном чате бота.
                </div>
            `;
        }, 2000);
        
    } catch (error) {
        battleResult.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// Обработчик сообщений от бота
function handleBotMessage(data) {
    console.log('Received data from bot:', data);
    // Обработка данных, пришедших от бота
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});

// Обработчик данных от Telegram Web App
if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.onEvent('webAppDataReceived', (event) => {
        try {
            const data = JSON.parse(event.data);
            handleBotMessage(data);
        } catch (error) {
            console.error('Error parsing web app data:', error);
        }
    });
}
