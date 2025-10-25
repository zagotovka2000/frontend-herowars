import React from 'react'

const UserInfo = ({ userData }) => {
  if (!userData) return null

  return (
    <div className="user-info">
      <div className="stat">
        <div>🏆 Уровень</div>
        <div className="stat-value">{userData.level}</div>
      </div>
      <div className="stat">
        <div>💰 Золото</div>
        <div className="stat-value">{userData.gold}</div>
      </div>
      <div className="stat">
        <div>💎 Самоцветы</div>
        <div className="stat-value">{userData.gems}</div>
      </div>
      <div className="stat">
        <div>🎯 Героев</div>
        <div className="stat-value">{userData.heroCount || 5}</div>
      </div>
    </div>
  )
}

export default UserInfo
