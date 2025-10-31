import { useRef, useCallback } from 'react';
import { Howl } from 'howler';

export const useSound = () => {
  const sounds = useRef({});

  const loadSound = useCallback((name, src) => {
    sounds.current[name] = new Howl({
      src: [src],
      preload: true,
      volume: 0.5
    });
  }, []);

  const playSound = useCallback((name) => {
    // Временно отключаем звуки для отладки
    // if (process.env.NODE_ENV === 'development') {
    //   return;
    // }
    
    if (sounds.current[name]) {
      sounds.current[name].play();
    } else {
      // Заглушка для звуков
      console.log(`Playing sound: ${name}`);
    }
  }, []);

  return { playSound, loadSound };
};
