// components/Common/BackButton.js
import React from 'react';
import { useNavigation } from '../../contex/NavigationContext';
import './BackButton.css';

const BackButton = ({ 
  position = { top: '20px', left: '20px' },
  size = 'medium',
  customText = null 
}) => {
  const { navigateBack, canGoBack } = useNavigation();

  if (!canGoBack) {
    return null; // Не показываем кнопку на главном экране
  }

  const handleClick = () => {
    navigateBack();
  };

  const buttonClass = `back-button back-button--${size}`;

  return (
    <button
      className={buttonClass}
      style={position}
      onClick={handleClick}
      title="Вернуться назад"
    >
      <span className="back-button-icon">←</span>
      <span className="back-button-text">
        {customText || 'Назад'}
      </span>
    </button>
  );
};

export default BackButton;
