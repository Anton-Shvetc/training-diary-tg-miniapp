import React, { useEffect, useState } from 'react';
import './App.css';

// Импортируем Telegram WebApp
const tg = window.Telegram?.WebApp;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (tg) {
      // Инициализируем WebApp
      tg.ready();
      tg.expand(); // Раскрываем на весь экран
      
      // Получаем данные пользователя
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  const handleButtonClick = () => {
    if (tg) {
      // Показываем всплывающее уведомление
      tg.showPopup({
        title: 'Уведомление',
        message: 'Вы нажали на кнопку! 🎉',
        buttons: [{ type: 'ok' }]
      });
    } else {
      alert('Вы нажали на кнопку! 🎉');
    }
  };

  const closeApp = () => {
    if (tg) {
      tg.close();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Мое Telegram Web App</h1>
        
        {user && (
          <div className="user-info">
            <p>Привет, {user.first_name}!</p>
          </div>
        )}

        <button 
          className="main-button"
          onClick={handleButtonClick}
        >
          Нажми меня!
        </button>

        <button 
          className="close-button"
          onClick={closeApp}
        >
          Закрыть приложение
        </button>
      </header>
    </div>
  );
}

export default App;