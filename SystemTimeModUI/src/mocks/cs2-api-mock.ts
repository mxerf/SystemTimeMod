// Моки для CS2 API для разработки в dev-сервере

// Для cs2/api
export const bindValue = (module: string, method: string, defaultValue: any) => {
  console.log(`[Mock] bindValue called: ${module}.${method}`);
  
  // Мок для настроек
  if (module === 'SystemTimeMod' && method === 'GetSettings') {
    return {
      value: JSON.stringify({
        language: '', // '' = Auto, 'en-US' = English, 'ru-RU' = Russian
        use24HourFormat: true,
        showSeconds: true,
        showDate: true,
        widgetSize: 1, // 0=small, 1=medium, 2=large
        customPositionX: 0,
        customPositionY: 0,
        useCustomPosition: false,
      }),
      subscribe: (listener?: any) => {
        // Имитируем изменение настроек каждые 10 секунд для теста
        const interval = setInterval(() => {
          if (listener) {
            const languages = ['', 'en-US', 'ru-RU'];
            listener(JSON.stringify({
              language: languages[Math.floor(Math.random() * languages.length)],
              use24HourFormat: Math.random() > 0.5,
              showSeconds: Math.random() > 0.5,
              showDate: true,
              widgetSize: Math.floor(Math.random() * 3),
              customPositionX: 0,
              customPositionY: 0,
              useCustomPosition: false,
            }));
          }
        }, 10000);
        
        return {
          dispose: () => clearInterval(interval)
        };
      },
      dispose: () => {}
    };
  }
  
  // Мок для языка
  if (module === 'SystemTimeMod' && method === 'GetLanguage') {
    return {
      value: 'ru-RU',
      subscribe: (listener?: any) => {
        return { dispose: () => {} };
      },
      dispose: () => {}
    };
  }
  
  return {
    value: defaultValue,
    subscribe: () => ({ dispose: () => {} }),
    dispose: () => {}
  };
};

export const useValue = (binding: any) => {
  return binding.value;
};

// Для cohtml/cohtml
const engine = {
  call: async (method: string, ...args: any[]) => {
    console.log(`[Mock] engine.call: ${method}`, args);
    
    if (method === 'SystemTimeMod.SaveWidgetPosition') {
      console.log('[Mock] Widget position saved:', args[0]);
      return Promise.resolve('');
    }
    
    return Promise.resolve('');
  }
};

export default engine;

// Для cs2/modding
export type ModRegistrar = (moduleRegistry: any) => void;
