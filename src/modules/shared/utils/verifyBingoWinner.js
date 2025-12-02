export const QUINA_RULES = {
  CENTER_ROW: 'CENTER_ROW',
  CENTER_COL: 'CENTER_COL',
  DIAGONALS: 'DIAGONALS'
};

export function checkBingoWin({ cardNumbers, drawnNumbers }) {
  // console.log({ cardNumbers, drawnNumbers });
  const drawnSet = new Set(drawnNumbers);
  return cardNumbers?.filter((num) => num !== 'FREE').every((num) => drawnSet.has(num));
}

export function checkQuinaWin({ cardNumbers, drawnNumbers, rules = {} }) {
  const drawnSet = new Set(drawnNumbers);
  const isMatch = (index) => {
    // Always treat the center (index 12) as a match (FREE space)
    if (index === 12) return true;
    
    const num = cardNumbers[index];
    return num === 'FREE' || drawnSet.has(num);
  };

  // Indices for specific lines passing through center (index 12)
  const centerRowIndices = [10, 11, 12, 13, 14]; // Row 3
  const centerColIndices = [2, 7, 12, 17, 22];   // Col 3
  const diagonal1Indices = [0, 6, 12, 18, 24];   // Top-Left to Bottom-Right
  const diagonal2Indices = [4, 8, 12, 16, 20];   // Top-Right to Bottom-Left

  if (rules[QUINA_RULES.CENTER_ROW] && centerRowIndices.every(isMatch)) return true;
  if (rules[QUINA_RULES.CENTER_COL] && centerColIndices.every(isMatch)) return true;
  
  if (rules[QUINA_RULES.DIAGONALS]) {
    if (diagonal1Indices.every(isMatch)) return true;
    if (diagonal2Indices.every(isMatch)) return true;
  }

  return false;
}
