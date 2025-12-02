export function BallDraw(drawnNumbers = []) {
  let letter = null;
  let ballNumber = Math.floor(Math.random() * 125) + 1;

  // Check if number is already drawn
  while (drawnNumbers.includes(ballNumber)) {
    ballNumber = Math.floor(Math.random() * 125) + 1;
  }

  if (ballNumber >= 1 && ballNumber <= 25) {
    letter = 'B';
  } else if (ballNumber >= 26 && ballNumber <= 50) {
    letter = 'I';
  } else if (ballNumber >= 51 && ballNumber <= 75) {
    letter = 'N';
  } else if (ballNumber >= 76 && ballNumber <= 100) {
    letter = 'G';
  } else if (ballNumber >= 101 && ballNumber <= 125) {
    letter = 'O';
  }

  return letter + '-' + ballNumber;
}
