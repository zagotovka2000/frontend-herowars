import React, { useRef, useEffect } from 'react';
import './BattleField2D.css';

const BattleField2D = ({ battleState, onAction, currentTurn, currentAnimation }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем фон
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем разделительную линию
    ctx.strokeStyle = '#333';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Распределяем атакующих (слева)
    const attackers = battleState.attackers || [];
    const defenders = battleState.defenders || [];
    
    // Функция для распределения позиций с глубиной
    const getUnitPositions = (units, isLeft) => {
      const positions = [];
      const rows = 3; // Максимум 3 ряда
      const baseX = isLeft ? canvas.width * 0.25 : canvas.width * 0.75;
      const baseY = canvas.height * 0.4;
      
      units.forEach((unit, index) => {
        const row = index % rows;
        const col = Math.floor(index / rows);
        
        // Случайное смещение для естественного вида
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 30;
        
        // Глубина (z-координата) влияет на размер и вертикальную позицию
        const depth = (col / Math.max(1, Math.ceil(units.length / rows))) * 0.6 + 0.4;
        
        positions.push({
          x: baseX + (isLeft ? -col * 30 : col * 30) + offsetX,
          y: baseY + (row - 1) * 60 + offsetY,
          scale: depth,
          unit
        });
      });
      
      return positions;
    };
    
    // Рисуем атакующих
    const attackerPositions = getUnitPositions(attackers, true);
    attackerPositions.forEach(({ x, y, scale, unit }) => {
      drawUnit(ctx, x, y, scale, unit, true, unit.id === currentTurn);
    });
    
    // Рисуем защитников
    const defenderPositions = getUnitPositions(defenders, false);
    defenderPositions.forEach(({ x, y, scale, unit }) => {
      drawUnit(ctx, x, y, scale, unit, false, unit.id === currentTurn);
    });
    
    // Рисуем индикаторы здоровья
    [...attackerPositions, ...defenderPositions].forEach(({ x, y, scale, unit }) => {
      drawHealthBar(ctx, x, y - 40, scale, unit);
    });
    
  }, [battleState, currentTurn]);

  // Функция для рисования юнита
  const drawUnit = (ctx, x, y, scale, unit, isAttacker, isCurrentTurn) => {
    const size = 30 * scale;
    
    // Выбор цвета в зависимости от типа и статуса
    let color = isAttacker ? '#e74c3c' : '#3498db';
    if (isCurrentTurn) color = '#f1c40f';
    if (unit.health <= 0) color = '#7f8c8d';
    
    // Тело юнита
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Обводка для текущего хода
    if (isCurrentTurn) {
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Иконка типа юнита
    ctx.fillStyle = '#fff';
    ctx.font = `${12 * scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(unit.type?.charAt(0) || 'U', x, y);
    
    // Индикатор атаки/защиты
    ctx.font = `${10 * scale}px Arial`;
    ctx.fillText(`${unit.attack || 0}`, x - 8, y + 15);
    ctx.fillText(`${unit.defense || 0}`, x + 8, y + 15);
  };

  // Функция для рисования полоски здоровья
  const drawHealthBar = (ctx, x, y, scale, unit) => {
    const width = 60 * scale;
    const height = 6 * scale;
    const healthPercent = Math.max(0, unit.health / (unit.maxHealth || 100));
    
    // Фон полоски
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x - width/2, y, width, height);
    
    // Здоровье
    ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : 
                   healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(x - width/2, y, width * healthPercent, height);
    
    // Обводка
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width/2, y, width, height);
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Здесь можно добавить логику обработки кликов по юнитам
    console.log('Clicked at:', x, y);
  };

  return (
    <div className="battle-field-2d">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onClick={handleCanvasClick}
        className="battle-canvas"
      />
      
      {/* Статус битвы */}
      <div className="battle-status">
        <div className="team-status attackers">
          <h3>Атакующие</h3>
          <div>Количество: {battleState.attackers?.length || 0}</div>
        </div>
        
        <div className="battle-info">
          <div className="turn-indicator">
          {currentTurn ? `Ход: ${currentTurn.name || currentTurn.id || 'Unknown'}` : 'Битва началась'}
          </div>
        </div>
        
        <div className="team-status defenders">
          <h3>Защитники</h3>
          <div>Количество: {battleState.defenders?.length || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default BattleField2D;
