// Servicios de cartillas
export {
  returnCard,
  returnCardByOrder,
  getGameCardsByEvent,
  deleteAllCardsByEvent,
  getGameCardsByEventPaginated,
  countCardsByEvent,
  checkCardAvailability,
  clearCardsPaginationCache,
  getGameCardsByUserEvent,
  getCardsByEventUsers
} from './services/cardsService';

// Componentes de cartillas
export { default as ReturnCardModal } from './components/ReturnCardModal';
export { default as CardsByGame } from './components/CardsByGame';
export { CardsTable } from './components/CardsTable';
export { GenerateCardModal } from './components/GenerateCardModal';
export { default as CardGame } from './components/CardGame';
export { SelectCardStep } from './components/SelectCardStep';
export { PurchaseSummaryStep } from './components/PurchaseSummaryStep';
export { default as StatsCardGame } from './components/StatsCardGame';

// Textos y estilos del módulo (export desde un punto central)
export { titles } from './card.texts';
export { uiStyles } from './card.styles';