import React, { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Text, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Компонент для 3D героя
const HeroModel = ({ 
  hero, 
  position, 
  onHeroClick, 
  isActive, 
  isTarget,
  animation 
}) => {
  const group = useRef()
  const { scene, animations } = useGLTF(getHeroModel(hero))
  const { actions, mixer } = useAnimations(animations, group)
  const [currentAnimation, setCurrentAnimation] = useState('Idle')

  // Загрузка и настройка модели
  useEffect(() => {
    if (scene) {
      // Настраиваем материалы и тени
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Настраиваем материалы для лучшего вида
          if (child.material) {
            child.material.metalness = 0.1
            child.material.roughness = 0.8
          }
        }
      })

      // Масштабируем модель под нужный размер
      group.current.scale.set(0.8, 0.8, 0.8)
    }
  }, [scene])

  // Управление анимациями
  useEffect(() => {
    if (actions && animations.length > 0) {
      // Останавливаем все анимации
      Object.values(actions).forEach(action => {
        if (action) action.stop()
      })

      // Воспроизводим нужную анимацию
      let animationToPlay = 'Idle'
      
      if (animation && animation.actorId === hero.id) {
        animationToPlay = 'Attack'
      } else if (animation && animation.targetId === hero.id && animation.damage > 0) {
        animationToPlay = 'Hit'
      } else if (!hero.isAlive) {
        animationToPlay = 'Death'
      } else if (isActive) {
        animationToPlay = 'Ready'
      }

      if (actions[animationToPlay]) {
        actions[animationToPlay].reset().fadeIn(0.5).play()
        setCurrentAnimation(animationToPlay)
      } else if (actions['Idle']) {
        actions['Idle'].reset().fadeIn(0.5).play()
        setCurrentAnimation('Idle')
      }

      // Возвращаем к Idle после атаки/получения урона
      if (['Attack', 'Hit'].includes(animationToPlay)) {
        const timeout = setTimeout(() => {
          if (hero.isAlive && actions['Idle']) {
            actions['Idle'].reset().fadeIn(0.5).play()
            setCurrentAnimation('Idle')
          }
        }, 1000)

        return () => clearTimeout(timeout)
      }
    }
  }, [actions, animations, hero.isAlive, isActive, animation])

  // Анимация плавающего эффекта для живых героев
  useFrame((state) => {
    if (group.current && hero.isAlive && currentAnimation === 'Idle') {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  // Подсветка для активных героев и целей
  useEffect(() => {
    if (group.current) {
      if (isActive || isTarget) {
        group.current.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(isActive ? 0x4444ff : 0xff4444)
            child.material.emissiveIntensity = 0.3
          }
        })
      } else {
        group.current.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x000000)
            child.material.emissiveIntensity = 0
          }
        })
      }
    }
  }, [isActive, isTarget])

  const handleClick = () => {
    if (onHeroClick) {
      onHeroClick(hero)
    }
  }

  return (
    <group 
      ref={group} 
      position={position}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <primitive object={scene} />
      
      {/* Индикатор здоровья */}
      {hero.isAlive && (
        <HealthBar 
          health={hero.health} 
          maxHealth={hero.maxHealth} 
          position={[0, 2.5, 0]}
        />
      )}
      
      {/* Имя героя */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color={hero.team === 'player' ? '#4FC3F7' : '#FF5252'}
        anchorX="center"
        anchorY="middle"
      >
        {hero.name}
      </Text>
    </group>
  )
}

// Компонент полоски здоровья
const HealthBar = ({ health, maxHealth, position }) => {
  const healthPercent = health / maxHealth
  
  return (
    <group position={position}>
      {/* Фон полоски */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshBasicMaterial color="#333" transparent opacity={0.8} />
      </mesh>
      
      {/* Заполнение здоровья */}
      <mesh position={[-(1.5 - 1.5 * healthPercent) / 2, 0, 0.01]}>
        <planeGeometry args={[1.5 * healthPercent, 0.15]} />
        <meshBasicMaterial 
          color={healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336'} 
          transparent 
          opacity={0.9} 
        />
      </mesh>
    </group>
  )
}

// Функция для получения пути к модели героя
const getHeroModel = (hero) => {
  const modelMap = {
    'Стальной Рыцарь': '/models/knight.glb',
    'Лесной Лучник': '/models/archer.glb',
    'Маг Огня': '/models/mage.glb',
    'Морская Волна': '/models/priest.glb',
    'Горный Гигант': '/models/warrior.glb',
    'Темный Рыцарь': '/models/dark-knight.glb',
    'Лесной Разбойник': '/models/rogue.glb',
    'Маг Тьмы': '/models/dark-mage.glb',
    'Морской Разрушитель': '/models/water-mage.glb',
    'Каменный Голем': '/models/golem.glb'
  }
  
  return modelMap[hero.name] || '/models/knight.glb'
}

// Загрузчик для моделей
const ModelLoader = () => {
  const models = [
    '/models/knight.glb',
    '/models/archer.glb',
    '/models/mage.glb',
    '/models/priest.glb',
    '/models/warrior.glb'
  ]
  
  return (
    <>
      {models.map(model => (
        <Suspense key={model} fallback={null}>
          <useGLTF preload url={model} />
        </Suspense>
      ))}
    </>
  )
}

// Основной компонент 3D поля боя
const ThreeJSBattleField = ({ 
  battleState, 
  onAction, 
  currentTurn,
  currentAnimation 
}) => {
  const [selectedHero, setSelectedHero] = useState(null)
  const [cameraPosition, setCameraPosition] = useState([15, 10, 15])

  const handleHeroClick = (hero) => {
    if (!battleState || !currentTurn) return

    const currentActor = battleState.playerHeroes.find(h => h.id === currentTurn.actorId) ||
                        battleState.enemyHeroes.find(h => h.id === currentTurn.actorId)

    if (!currentActor) return

    // Если кликнули на атакующего героя
    if (hero.id === currentActor.id && hero.team === 'player') {
      setSelectedHero(hero)
    }
    // Если выбрана цель для атаки
    else if (selectedHero && hero.team !== selectedHero.team && hero.isAlive) {
      onAction({
        actorId: selectedHero.id,
        targetId: hero.id,
        skillId: 0
      })
      setSelectedHero(null)
    }
  }

  // Позиции для героев на сцене
  const getHeroPosition = (hero, index, team) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    
    if (team === 'player') {
      return [-8 + col * 3, 0, -5 + row * 3]
    } else {
      return [8 - col * 3, 0, -5 + row * 3]
    }
  }

  if (!battleState) return null

  return (
    <div className="threejs-battle-field">
      <Canvas
        shadows
        camera={{ 
          position: cameraPosition,
          fov: 45,
          near: 0.1,
          far: 1000 
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#1a1a2e']} />
        
        {/* Освещение */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Окружение */}
        <Environment preset="city" />
        
        {/* Поле боя */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        
        {/* Декорации */}
        <mesh position={[0, 0, -8]} receiveShadow>
          <boxGeometry args={[25, 1, 1]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>

        {/* Предзагрузка моделей */}
        <ModelLoader />

        {/* Герои игрока */}
        {battleState.playerHeroes.map((hero, index) => (
          <Suspense key={hero.id} fallback={null}>
            <HeroModel
              hero={hero}
              position={getHeroPosition(hero, index, 'player')}
              onHeroClick={handleHeroClick}
              isActive={currentTurn?.actorId === hero.id}
              isTarget={selectedHero && hero.team !== selectedHero.team}
              animation={currentAnimation}
            />
          </Suspense>
        ))}

        {/* Герои противника */}
        {battleState.enemyHeroes.map((hero, index) => (
          <Suspense key={hero.id} fallback={null}>
            <HeroModel
              hero={hero}
              position={getHeroPosition(hero, index, 'enemy')}
              onHeroClick={handleHeroClick}
              isActive={currentTurn?.actorId === hero.id}
              isTarget={selectedHero && hero.team !== selectedHero.team}
              animation={currentAnimation}
            />
          </Suspense>
        ))}

        {/* Управление камерой */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          target={[0, 0, 0]}
        />

        {/* Вспомогательная сетка */}
        <gridHelper args={[30, 30, '#444', '#222']} />
      </Canvas>

      {/* UI подсказки */}
      <div className="battle-hints">
        {selectedHero && (
          <div className="hint">
            Выберите цель для {selectedHero.name}
          </div>
        )}
        {currentTurn && !selectedHero && (
          <div className="hint">
            Ход: {battleState.playerHeroes.find(h => h.id === currentTurn.actorId)?.name || 
                  battleState.enemyHeroes.find(h => h.id === currentTurn.actorId)?.name}
          </div>
        )}
      </div>
    </div>
  )
}

export default ThreeJSBattleField
