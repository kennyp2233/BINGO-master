import { bingoValues } from 'store/constant';
import { fullDate } from './validations';
import { generateId } from './idGenerator';
import { ACTIVE_CONFIG, getLetterConfig } from './bingoConfig';

// Función para generar un número aleatorio sin repetición
const generateUniqueNumbers = (min, max, count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

// Función para generar una cartilla de Bingo
const generateBingoCard = (event, eventName, eventPrice, cardNumber) => {
  const columns = {};

  // Generar números para cada letra usando la configuración centralizada
  ACTIVE_CONFIG.LETTERS.forEach(letter => {
    const config = getLetterConfig(letter);
    columns[letter] = generateUniqueNumbers(config.start, config.end, config.count);
    // Ordenar los números
    columns[letter].sort((a, b) => a - b);
  });

  // Insertar "FREE" en la posición central de N (si existe)
  if (columns.N) {
    const fullN = [...columns.N.slice(0, 2), 'FREE', ...columns.N.slice(2)];
    columns.N = fullN;
  }

  // Crear arrays para cada letra (manteniendo compatibilidad con el código existente)
  const allValues = {};
  ACTIVE_CONFIG.LETTERS.forEach(letter => {
    allValues[letter.toLowerCase()] = columns[letter];
  });

  // Crear array combinado de todos los valores
  const combinedValues = [];
  ACTIVE_CONFIG.LETTERS.forEach(letter => {
    combinedValues.push(...columns[letter]);
  });

  // Crear el objeto de la cartilla
  const card = {
    id: generateId(10),
    event: event,
    eventName: eventName,
    price: eventPrice,
    bingoNumbers: combinedValues,
    order: cardNumber,
    num: cardNumber + '',
    createAt: fullDate(),
    state: bingoValues.STATE_AVAILABLE
  };

  // Agregar propiedades dinámicas para cada letra
  ACTIVE_CONFIG.LETTERS.forEach(letter => {
    card[letter.toLowerCase()] = allValues[letter.toLowerCase()];
  });

  return card;
};

// Verificar si dos cartillas son iguales
const areCardsEqual = (card1, card2) => {
  return JSON.stringify(card1) === JSON.stringify(card2);
};

// Generar múltiples cartillas sin repetir ninguna
export const generateUniqueBingoCards = (count, event, eventName, eventPrice, cardNumber) => {
  const cards = [];
  while (cards.length < count) {
    const newCard = generateBingoCard(event, eventName, eventPrice, cardNumber + cards.length + 1);
    // Verificar si la cartilla ya fue generada
    if (!cards.some((card) => areCardsEqual(card, newCard))) {
      cards.push(newCard);
    }
  }
  return cards;
};
