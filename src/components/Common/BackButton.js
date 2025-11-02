import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { navigateBack, selectCanGoBack } from '../../store/slices/navigationSlice';
import './BackButton.css';

const BackButton = ({ 
  position = { top: '20px', left: '20px' },
  size = 'medium',
  customText = null 
}) => {
  const dispatch = useAppDispatch();
  const canGoBack = useAppSelector(selectCanGoBack);

  if (!canGoBack) {
    return null;
  }

  const handleClick = () => {
    dispatch(navigateBack());
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
