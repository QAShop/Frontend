// Утилиты для валидации форм авторизации и регистрации

/**
 * Валидация email адреса
 * @param {string} email - Email для проверки
 * @returns {object} - Объект с результатом валидации
 */
export const validateEmail = (email) => {
    const errors = [];
    
    if (!email) {
      errors.push('Email обязателен для заполнения');
      return { isValid: false, errors };
    }
    
    if (email.length > 254) {
      errors.push('Email не должен превышать 254 символа');
    }
    
    // Стандартная регулярка для email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      errors.push('Введите корректный email адрес');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Валидация логина (имени пользователя)
   * @param {string} username - Логин для проверки
   * @returns {object} - Объект с результатом валидации
   */
  export const validateUsername = (username) => {
    const errors = [];
    
    if (!username) {
      errors.push('Имя пользователя обязательно для заполнения');
      return { isValid: false, errors };
    }
    
    if (username.length < 3) {
      errors.push('Имя пользователя должно содержать минимум 3 символа');
    }
    
    if (username.length > 30) {
      errors.push('Имя пользователя не должно превышать 30 символов');
    }
    
    // Проверка на допустимые символы (буквы, цифры, подчеркивание, дефис)
    const usernameRegex = /^[a-zA-Zа-яА-Я0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      errors.push('Имя пользователя может содержать только буквы, цифры, подчеркивание и дефис');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Валидация пароля
   * @param {string} password - Пароль для проверки
   * @returns {object} - Объект с результатом валидации
   */
  export const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      errors.push('Пароль обязателен для заполнения');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('Пароль должен содержать минимум 6 символов');
    }
    
    if (password.length > 30) {
      errors.push('Пароль не должен превышать 30 символов');
    }
    
    // Проверка на наличие хотя бы одной заглавной буквы
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну заглавную букву');
    }
    
    // Проверка на наличие хотя бы одной строчной буквы
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну строчную букву');
    }
    
    // Проверка на наличие хотя бы одной цифры
    if (!/\d/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну цифру');
    }
    
    // Проверка на наличие хотя бы одного специального символа
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы один специальный символ (!@#$%^&* и т.д.)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Валидация всей формы регистрации
   * @param {object} formData - Данные формы
   * @returns {object} - Объект с результатами валидации
   */
  export const validateRegistrationForm = (formData) => {
    const { username, email, password } = formData;
    
    const usernameValidation = validateUsername(username);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    const allErrors = {
      username: usernameValidation.errors,
      email: emailValidation.errors,
      password: passwordValidation.errors
    };
    
    const isValid = usernameValidation.isValid && 
                    emailValidation.isValid && 
                    passwordValidation.isValid;
    
    return {
      isValid,
      errors: allErrors,
      hasErrors: Object.values(allErrors).some(errors => errors.length > 0)
    };
  };
  
  /**
   * Валидация формы входа
   * @param {object} formData - Данные формы
   * @returns {object} - Объект с результатами валидации
   */
  export const validateLoginForm = (formData) => {
    const { email, password } = formData;
    
    const emailValidation = validateEmail(email);
    const passwordErrors = [];
    
    if (!password) {
      passwordErrors.push('Пароль обязателен для заполнения');
    }
    
    const allErrors = {
      email: emailValidation.errors,
      password: passwordErrors
    };
    
    const isValid = emailValidation.isValid && passwordErrors.length === 0;
    
    return {
      isValid,
      errors: allErrors,
      hasErrors: Object.values(allErrors).some(errors => errors.length > 0)
    };
  };
  
  