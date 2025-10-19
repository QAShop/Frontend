import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const API_BASE_URL = 'https://backend-ocjc.onrender.com/api'; // Перенесите сюда или импортируйте

  // Функция для загрузки информации о пользователе
  const fetchUser = async (jwtToken) => {
    try {
      setIsLoadingUser(true);
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      setCurrentUser(null);
      localStorage.removeItem('jwt_token');
      setToken(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Эффект для загрузки пользователя при изменении токена
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setCurrentUser(null);
      setIsLoadingUser(false);
    }
  }, [token]);

  // Функции для входа, регистрации и выхода
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem('jwt_token', data.access_token);
      setToken(data.access_token);
      await fetchUser(data.access_token); // Обновляем данные пользователя сразу после входа
      return { success: true };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error("Пользователь с таким email или именем пользователя уже существует.");
        } else {
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      }
      // Если регистрация успешна, можно сразу залогинить пользователя или просто сообщить об успехе
      // В данном случае, просто сообщаем об успехе, логин будет отдельным шагом
      return { success: true };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  const value = {
    currentUser,
    isLoadingUser,
    token,
    login,
    register,
    logout,
    fetchUser // Возможно, понадобится для принудительного обновления данных пользователя
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Пользовательский хук для удобного доступа к контексту аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

