// src/utils/validators.ts

export const isValidEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidUsername = (username: string): boolean => {
  // Example: Username must be 3-20 characters, alphanumeric and underscores
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

/**
 * Validates the strength of a password.
 * Example criteria: At least 6 characters. You can enhance this as needed.
 * @param password - The password string to validate.
 * @returns True if valid, false otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
  // For stronger validation, you can include checks for uppercase, numbers, special characters, etc.
  // Example:
  // const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  // return re.test(password);
};
