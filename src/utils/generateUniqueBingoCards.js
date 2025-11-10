import { bingoValues } from 'store/constant';
import { fullDate } from './validations';
import { generateId } from './idGenerator';

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
  const columns = {
    B: generateUniqueNumbers(1, 25, 5),
    I: generateUniqueNumbers(26, 50, 5),
    N: generateUniqueNumbers(51, 75, 4), // 4 números porque la posición central es "Free"
    G: generateUniqueNumbers(76, 100, 5),
    O: generateUniqueNumbers(101, 125, 5)
  };

  // Insertar "FREE" en la posición central
  const fullN = [...columns.N.slice(0, 2), 'FREE', ...columns.N.slice(2)];

  // Crear un objeto con los valores de las columnas y todos los valores combinados
  const allValues = {
    B: columns.B,
    I: columns.I,
    N: fullN,
    G: columns.G,
    O: columns.O
  };

  const combinedValues = [...columns.B, ...columns.I, ...fullN, ...columns.G, ...columns.O];

  return {
    id: generateId(10),
    event: event,
    eventName: eventName,
    price: eventPrice,
    b: allValues.B,
    i: allValues.I,
    n: allValues.N,
    g: allValues.G,
    o: allValues.O,
    bingoNumbers: combinedValues,
    order: cardNumber,
    num: cardNumber + '',
    createAt: fullDate(),
    state: bingoValues.STATE_AVAILABLE
  };
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
