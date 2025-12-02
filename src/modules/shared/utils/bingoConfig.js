// Configuración centralizada del Bingo
export const BINGO_CONFIG = {
  // Configuración por defecto (tradicional 75 bolas)
  DEFAULT: {
    LETTERS: ['B', 'I', 'N', 'G', 'O'],
    NUMBERS_PER_LETTER: 25, // 25 números por letra (excepto N que tiene 24 + FREE)
    TOTAL_NUMBERS: 125,
    RANGES: {
      B: { start: 1, end: 25, count: 5 },
      I: { start: 26, end: 50, count: 5 },
      N: { start: 51, end: 75, count: 4 }, // 4 porque el centro es FREE
      G: { start: 76, end: 100, count: 5 },
      O: { start: 101, end: 125, count: 5 }
    }
  },

  // Configuración alternativa (90 bolas)
  EXTENDED: {
    LETTERS: ['B', 'I', 'N', 'G', 'O'],
    NUMBERS_PER_LETTER: 30,
    TOTAL_NUMBERS: 90,
    RANGES: {
      B: { start: 1, end: 30, count: 6 },
      I: { start: 31, end: 60, count: 6 },
      N: { start: 61, end: 90, count: 5 }, // 5 porque el centro es FREE
      G: { start: 91, end: 120, count: 6 },
      O: { start: 121, end: 150, count: 6 }
    }
  }
};

// Configuración activa (puede cambiarse dinámicamente)
export let ACTIVE_CONFIG = BINGO_CONFIG.DEFAULT;

// Función para cambiar la configuración activa
export const setBingoConfig = (configName) => {
  if (BINGO_CONFIG[configName]) {
    ACTIVE_CONFIG = BINGO_CONFIG[configName];
  } else {
    console.warn(`Configuración ${configName} no encontrada, usando DEFAULT`);
    ACTIVE_CONFIG = BINGO_CONFIG.DEFAULT;
  }
};

// Función para obtener la configuración de una letra específica
export const getLetterConfig = (letter) => {
  return ACTIVE_CONFIG.RANGES[letter.toUpperCase()];
};

// Función para obtener todas las letras
export const getLetters = () => {
  return ACTIVE_CONFIG.LETTERS;
};

// Función para obtener el número total de números
export const getTotalNumbers = () => {
  return ACTIVE_CONFIG.TOTAL_NUMBERS;
};

// Función para obtener los números de una letra
export const getLetterNumbers = (letter) => {
  const config = getLetterConfig(letter);
  if (!config) return [];

  const numbers = [];
  for (let i = config.start; i <= config.end; i++) {
    numbers.push(i);
  }
  return numbers;
};

// Función para validar si un número pertenece a una letra
export const getLetterForNumber = (number) => {
  for (const letter of ACTIVE_CONFIG.LETTERS) {
    const config = getLetterConfig(letter);
    if (number >= config.start && number <= config.end) {
      return letter;
    }
  }
  return null;
};

// Función para obtener el rango completo como string
export const getRangeString = (letter) => {
  const config = getLetterConfig(letter);
  return `${config.start}-${config.end}`;
};