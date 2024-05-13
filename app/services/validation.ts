export const validateEmail = (email: string): string | null => {
    const emailValidation = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailValidation.test(email)) {
      return "Проверяйте вводимые символы";
    }
    return null;
  };
  
  export const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Пароль должен быть не менее 6 знаков";
    }
    return null;
  };

  