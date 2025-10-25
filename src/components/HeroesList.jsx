import React from 'react'

const HeroesList = ({ heroes, userData, onUpgradeHero }) => {
  if (!heroes || heroes.length === 0) {
    return <div className="error">❌ У вас пока нет героев</div>
  }

  return (
    <div className="heroes-list">
      <h2>Ваши герои</h2>
      <div className="heroes-grid">
        {heroes.map(hero => (
          <div key={hero.id} className="hero-card">
            <h3>{hero.name} (Ур. {hero.level})</h3>
            <div className="hero-stats">
              <div className="stat-item">❤️ Здоровье: {hero.health}</div>
              <div className="stat-item">⚔️ Атака: {hero.attack}</div>
              <div className="stat-item">🛡️ Защита: {hero.defense}</div>
              <div className="stat-item">🏃 Скорость: {hero.speed}</div>
              <div className="stat-item">🎯 Крит: {(hero.criticalChance * 100).toFixed(1)}%</div>
              <div className="stat-item">💥 Урон крита: {hero.criticalDamage.toFixed(1)}x</div>
            </div>
            <button 
              className="upgrade-btn"
              onClick={() => onUpgradeHero(hero.id)}
              disabled={userData.gold < hero.level * 100}
            >
              🚀 Улучшить ({hero.level * 100} золота)
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroesList
