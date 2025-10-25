import React, { useState, useEffect, useRef } from 'react'
import { Stage, Sprite, Text, Container } from '@pixi/react'
import { Texture, Rectangle } from 'pixi.js'
import { battleService } from '../services/api'

const BattleScene = () => {
  const [battleData, setBattleData] = useState(null)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [animations, setAnimations] = useState([])

  useEffect(() => {
    initializeBattle()
  }, [])

  const initializeBattle = async () => {
    try {
      // В разработке используем mock данные или API
      const data = await battleService.startBattle(1) // userId = 1 для разработки
      setBattleData(data)
    } catch (error) {
      console.error('Failed to start battle:', error)
    }
  }

  const executeTurn = async (action) => {
    if (!battleData) return

    try {
      const result = await battleService.executeTurn(battleData.id, action)
      setAnimations(prev => [...prev, result.animation])
      
      if (result.battleFinished) {
        // Бой завершен
        console.log('Battle finished:', result.battleFinished)
      } else {
        setBattleData(result.newState)
      }
    } catch (error) {
      console.error('Turn execution failed:', error)
    }
  }

  if (!battleData) {
    return <div>Loading battle...</div>
  }

  return (
    <div className="battle-scene">
      <Stage width={800} height={600} options={{ backgroundColor: 0x2c3e50 }}>
        {/* Рендерим героев */}
        {battleData.playerHeroes.map(hero => (
          <BattleHero key={hero.id} hero={hero} onAction={executeTurn} />
        ))}
        {battleData.enemyHeroes.map(hero => (
          <BattleHero key={hero.id} hero={hero} isEnemy={true} />
        ))}
        
        {/* Рендерим анимации */}
        {animations.map((animation, index) => (
          <BattleAnimation key={index} animation={animation} />
        ))}
      </Stage>
    </div>
  )
}

const BattleHero = ({ hero, isEnemy = false, onAction }) => {
  const [position, setPosition] = useState(hero.position)

  const handleClick = () => {
    if (!isEnemy && onAction) {
      // Для простоты - базовая атака по первому живому врагу
      onAction({
        actorId: hero.id,
        targetId: 1, // В реальности нужно выбрать цель
        skillId: 0 // Базовая атака
      })
    }
  }

  return (
    <Container position={[position.x, position.y]}>
      <Sprite
        texture={Texture.WHITE}
        width={50}
        height={50}
        tint={isEnemy ? 0xff0000 : 0x00ff00}
        interactive={!isEnemy}
        pointerdown={handleClick}
      />
      <Text
        text={hero.name}
        style={{ fontSize: 12, fill: 0xffffff }}
        anchor={0.5}
        y={-10}
      />
      <HealthBar health={hero.health} maxHealth={hero.maxHealth} />
    </Container>
  )
}

const HealthBar = ({ health, maxHealth }) => {
  const width = 50
  const height = 5
  const healthPercent = health / maxHealth

  return (
    <Container y={-20}>
      <Sprite
        texture={Texture.WHITE}
        width={width}
        height={height}
        tint={0xff0000}
      />
      <Sprite
        texture={Texture.WHITE}
        width={width * healthPercent}
        height={height}
        tint={0x00ff00}
      />
    </Container>
  )
}

const BattleAnimation = ({ animation }) => {
  // Реализация анимаций для WebGL
  return null
}

export default BattleScene
