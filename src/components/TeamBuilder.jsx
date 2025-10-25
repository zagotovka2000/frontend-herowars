import React, { useState } from 'react'

const TeamBuilder = ({ heroes, selectedTeam, onAddToTeam, onSaveTeam }) => {
  const [showHeroSelect, setShowHeroSelect] = useState(null)

  const handleSlotClick = (position) => {
    setShowHeroSelect(position)
  }

  const handleHeroSelect = (heroId) => {
    onAddToTeam(heroId, showHeroSelect)
    setShowHeroSelect(null)
  }

  const getHeroInSlot = (position) => {
    const heroId = selectedTeam[position - 1]
    return heroes.find(h => h.id === heroId)
  }

  return (
    <div className="team-builder">
      <h2>Создание команды</h2>
      <p>Выберите 5 героев для вашей команды:</p>
      
      <div className="team-slots">
        {[1, 2, 3, 4, 5].map(position => {
          const hero = getHeroInSlot(position)
          return (
            <div
              key={position}
              className={`team-slot ${hero ? 'filled' : ''}`}
              onClick={() => handleSlotClick(position)}
            >
              {hero ? (
                <>
                  <strong>{hero.name}</strong><br />
                  <small>Ур. {hero.level}</small>
                </>
              ) : (
                `Позиция ${position}`
              )}
            </div>
          )
        })}
      </div>

      <button className="save-btn" onClick={onSaveTeam}>
        💾 Сохранить команду
      </button>

      {/* Модальное окно выбора героя */}
      {showHeroSelect && (
        <div className="modal-overlay" onClick={() => setShowHeroSelect(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Выберите героя для позиции {showHeroSelect}</h3>
            <div className="hero-options">
              {heroes.map(hero => (
                <div
                  key={hero.id}
                  className="hero-option"
                  onClick={() => handleHeroSelect(hero.id)}
                >
                  <strong>{hero.name}</strong> (Ур. {hero.level})<br />
                  <small>❤️ {hero.health} | ⚔️ {hero.attack} | 🛡️ {hero.defense}</small>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowHeroSelect(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamBuilder
