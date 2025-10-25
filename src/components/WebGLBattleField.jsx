import React, { useEffect, useRef, useState } from 'react'
import { Application, Graphics, Text, Container, Sprite, Texture } from 'pixi.js'

const WebGLBattleField = ({ battleState, onAction, currentTurn }) => {
  const canvasRef = useRef(null)
  const appRef = useRef(null)
  const [pixiApp, setPixiApp] = useState(null)
  const [heroSprites, setHeroSprites] = useState({})

  useEffect(() => {
    const initPixi = async () => {
      const app = new Application({
        width: 800,
        height: 500,
        backgroundColor: 0x2c3e50,
        view: canvasRef.current,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      })

      appRef.current = app
      setPixiApp(app)

      return () => {
        if (app) {
          app.destroy(true)
        }
      }
    }

    if (canvasRef.current) {
      initPixi()
    }
  }, [])

  useEffect(() => {
    if (!pixiApp || !battleState) return

    // Очищаем сцену
    pixiApp.stage.removeChildren()

    // Создаем контейнер для поля боя
    const battleContainer = new Container()
    pixiApp.stage.addChild(battleContainer)

    // Рендерим героев
    renderHeroes(battleState.playerHeroes, battleState.enemyHeroes, battleContainer)

    // Рендерим UI поверх WebGL
    renderBattleUI()

  }, [pixiApp, battleState])

  const renderHeroes = (playerHeroes, enemyHeroes, container) => {
    const sprites = {}

    // Рендерим героев игрока (левая сторона)
    playerHeroes.forEach((hero, index) => {
      const heroSprite = createHeroSprite(hero, 'player', index)
      container.addChild(heroSprite)
      sprites[hero.id] = heroSprite
    })

    // Рендерим героев противника (правая сторона)
    enemyHeroes.forEach((hero, index) => {
      const heroSprite = createHeroSprite(hero, 'enemy', index)
      container.addChild(heroSprite)
      sprites[hero.id] = heroSprite
    })

    setHeroSprites(sprites)
  }

  const createHeroSprite = (hero, team, index) => {
    const container = new Container()
    
    // Позиционируем в зависимости от команды и позиции
    const x = team === 'player' ? 150 + index * 120 : 550 + index * 120
    const y = 150 + (index % 2) * 100
    
    container.x = x
    container.y = y

    // Создаем тело героя (квадрат с цветом в зависимости от класса)
    const body = new Graphics()
    const color = getHeroColor(hero)
    body.beginFill(color)
    body.drawRect(-25, -25, 50, 50)
    body.endFill()
    container.addChild(body)

    // Добавляем полоску здоровья
    const healthBar = createHealthBar(hero.health, hero.maxHealth)
    healthBar.y = -40
    container.addChild(healthBar)

    // Добавляем имя героя
    const nameText = new Text(hero.name, {
      fontSize: 12,
      fill: 0xffffff,
      align: 'center'
    })
    nameText.anchor.set(0.5)
    nameText.y = -55
    container.addChild(nameText)

    // Добавляем уровень
    const levelText = new Text(`Lvl ${hero.level}`, {
      fontSize: 10,
      fill: 0xffff00
    })
    levelText.anchor.set(0.5)
    levelText.y = 35
    container.addChild(levelText)

    // Если герой мертв, добавляем эффект
    if (!hero.isAlive) {
      const deathOverlay = new Graphics()
      deathOverlay.beginFill(0x000000, 0.7)
      deathOverlay.drawRect(-25, -25, 50, 50)
      deathOverlay.endFill()
      
      const deathText = new Text('💀', { fontSize: 20 })
      deathText.anchor.set(0.5)
      container.addChild(deathOverlay)
      container.addChild(deathText)
    }

    // Делаем интерактивным если это ход героя
    if (hero.isAlive && currentTurn?.actorId === hero.id) {
      container.interactive = true
      container.buttonMode = true
      container.on('pointerdown', () => onHeroClick(hero))
    }

    return container
  }

  const createHealthBar = (currentHealth, maxHealth) => {
    const healthPercent = currentHealth / maxHealth
    const barWidth = 50
    const barHeight = 6

    const container = new Container()

    // Фон полоски здоровья
    const background = new Graphics()
    background.beginFill(0x000000)
    background.drawRect(-barWidth/2, 0, barWidth, barHeight)
    background.endFill()

    // Заполнение здоровья
    const healthFill = new Graphics()
    const fillColor = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000
    healthFill.beginFill(fillColor)
    healthFill.drawRect(-barWidth/2, 0, barWidth * healthPercent, barHeight)
    healthFill.endFill()

    container.addChild(background)
    container.addChild(healthFill)

    return container
  }

  const getHeroColor = (hero) => {
    const colors = {
      fire: 0xff4444,
      water: 0x4444ff,
      nature: 0x44ff44,
      earth: 0x8B4513,
      default: 0x888888
    }
    return colors[hero.element] || colors.default
  }

  const onHeroClick = (hero) => {
    if (hero.team === 'player' && currentTurn?.actorId === hero.id) {
      // Показываем выбор цели для атаки
      showTargetSelection(hero)
    } else if (currentTurn?.type === 'select_target') {
      // Выбор цели для атаки
      onAction({
        actorId: currentTurn.actorId,
        targetId: hero.id,
        skillId: 0 // Базовая атака
      })
    }
  }

  const showTargetSelection = (attacker) => {
    // Подсвечиваем возможные цели
    Object.values(heroSprites).forEach(sprite => {
      const hero = findHeroById(sprite.userData?.heroId)
      if (hero && hero.team !== attacker.team && hero.isAlive) {
        // Добавляем подсветку
        const highlight = new Graphics()
        highlight.lineStyle(3, 0xffff00)
        highlight.drawRect(-30, -30, 60, 60)
        sprite.addChild(highlight)
        sprite.userData.highlight = highlight
        
        // Делаем интерактивным для выбора цели
        sprite.interactive = true
        sprite.buttonMode = true
        sprite.on('pointerdown', () => {
          onAction({
            actorId: attacker.id,
            targetId: hero.id,
            skillId: 0
          })
        })
      }
    })
  }

  const findHeroById = (heroId) => {
    return [...battleState.playerHeroes, ...battleState.enemyHeroes]
      .find(hero => hero.id === heroId)
  }

  const renderBattleUI = () => {
    // Можно добавить дополнительный UI поверх WebGL
  }

  // Анимация атаки
  const animateAttack = (animation) => {
    if (!pixiApp || !animation) return

    const attacker = heroSprites[animation.actorId]
    const target = heroSprites[animation.targetId]

    if (attacker && target) {
      // Анимация перемещения к цели
      const startX = attacker.x
      const startY = attacker.y
      const targetX = target.x
      const targetY = target.y

      // Временно смещаем атакующего к цели
      const attackDistance = 30
      const dx = targetX - startX
      const dy = targetY - startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const moveX = (dx / distance) * attackDistance
      const moveY = (dy / distance) * attackDistance

      attacker.x = startX + moveX
      attacker.y = startY + moveY

      // Эффект попадания
      const hitEffect = new Graphics()
      hitEffect.beginFill(animation.isCritical ? 0xff0000 : 0xffffff)
      hitEffect.drawCircle(targetX, targetY, 10)
      hitEffect.endFill()
      hitEffect.alpha = 0.8
      
      pixiApp.stage.addChild(hitEffect)

      // Текст урона
      const damageText = new Text(`-${animation.damage}`, {
        fontSize: 20,
        fill: animation.isCritical ? 0xff0000 : 0xffffff,
        fontWeight: 'bold'
      })
      damageText.anchor.set(0.5)
      damageText.x = targetX
      damageText.y = targetY - 40
      pixiApp.stage.addChild(damageText)

      // Возвращаем атакующего на место и убираем эффекты
      setTimeout(() => {
        attacker.x = startX
        attacker.y = startY
        pixiApp.stage.removeChild(hitEffect)
        pixiApp.stage.removeChild(damageText)
      }, 500)
    }
  }

  return (
    <div className="webgl-battle-field">
      <canvas ref={canvasRef} />
      <div className="battle-controls">
        <button 
          className="auto-battle-btn"
          onClick={() => console.log('Auto battle')}
        >
          🤖 Авто-битва
        </button>
      </div>
    </div>
  )
}

export default WebGLBattleField
