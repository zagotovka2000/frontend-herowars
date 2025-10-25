import React, { useState, useEffect } from 'react'
import UserInfo from './components/UserInfo'
import HeroesList from './components/HeroesList'
import TeamBuilder from './components/TeamBuilder'
import BattleArena from './components/BattleArena'
import { loadGameData, loadMockData } from './services/api'

function App() {
  const [activeTab, setActiveTab] = useState('heroes')
  const [userData, setUserData] = useState(null)
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState([])

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      const mockData = await loadMockData()
      setUserData(mockData.user)
      setHeroes(mockData.heroes)
    } catch (error) {
      console.error('Error initializing app:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeHero = (heroId) => {
    const hero = heroes.find(h => h.id === heroId)
    const upgradeCost = hero.level * 100
    
    if (userData.gold >= upgradeCost) {
      setUserData(prev => ({
        ...prev,
        gold: prev.gold - upgradeCost
      }))
      
      setHeroes(prev => prev.map(h => 
        h.id === heroId 
          ? { 
              ...h, 
              level: h.level + 1,
              health: h.health + 10,
              attack: h.attack + 5,
              defense: h.defense + 2
            }
          : h
      ))
    }
  }

  const handleAddToTeam = (heroId, position) => {
    setSelectedTeam(prev => {
      const newTeam = [...prev]
      newTeam[position - 1] = heroId
      return newTeam
    })
  }

  const handleSaveTeam = () => {
    console.log('Saving team:', selectedTeam)
    alert('Команда сохранена!')
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Загрузка данных...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🎮 Hero Wars</h1>
        <p>Собери команду и стань легендой!</p>
      </div>

      <UserInfo userData={userData} />

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'heroes' ? 'active' : ''}`}
          onClick={() => setActiveTab('heroes')}
        >
          🏹 Мои Герои
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          ⚔️ Команда
        </button>
        <button 
          className={`tab-button ${activeTab === 'battle' ? 'active' : ''}`}
          onClick={() => setActiveTab('battle')}
        >
          🎯 Битва
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'heroes' && (
          <HeroesList 
            heroes={heroes} 
            userData={userData}
            onUpgradeHero={handleUpgradeHero}
          />
        )}
        
        {activeTab === 'team' && (
          <TeamBuilder 
            heroes={heroes}
            selectedTeam={selectedTeam}
            onAddToTeam={handleAddToTeam}
            onSaveTeam={handleSaveTeam}
          />
        )}
        
        {activeTab === 'battle' && (
          <BattleArena 
            heroes={heroes}
            selectedTeam={selectedTeam}
          />
        )}
      </div>
    </div>
  )
}

export default App
