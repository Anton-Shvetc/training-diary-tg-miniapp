import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      const userData = tg.initDataUnsafe?.user;
      if (userData) {
        setUser(userData);
      }

      // Включаем кнопку закрытия
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        tg.close();
      });
    }
  }, []);

  const handleButtonClick = async () => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Показываем уведомление в Telegram
      tg.showPopup({
        title: "Уведомление",
        message: "Вы нажали на кнопку! 🎉",
        buttons: [{ type: "ok" }],
      });

      // Отправляем данные на сервер
      try {
        await axios.post("/api/webhook", {
          action: "button_click",
          userId: user?.id,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error sending data to server:", error);
      }
    } else {
      // Для разработки вне Telegram
      alert("Вы нажали на кнопку! 🎉");
    }
  };

  const sendMessageToUser = async () => {
    if (!user) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/api/send-message",
        {
          chatId: user.id,
          text: message || "Привет от WebApp!",
        }
      );

      console.log("Message sent:", response.data);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Telegram Mini App</h1>

        {user && (
          <div className="user-info">
            <p>Привет, {user.first_name}!</p>
            <p>ID: {user.id}</p>
          </div>
        )}

        <button className="main-button" onClick={handleButtonClick}>
          Нажми меня!
        </button>

        <div className="message-section">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="message-input"
          />
          <button onClick={sendMessageToUser} className="send-button">
            Отправить себе
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
