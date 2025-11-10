export function BallDraw() {
  let ballDrawnNumber = [];
  let ballDrawnLetter = [];
  let letter = null;

  let repeat = 0;
  let ballLetter;
  let ballNumber = 1 * Math.floor(Math.random() * 125);

  for (var index = 0; index < 125; index++) {
    if (ballNumber == ballDrawnNumber[index] && ballLetter == ballDrawnLetter[index]) {
      repeat++;
    }
  }
  if (repeat == 0) {
    if (ballNumber < 25) {
      letter = 'B';
      ballDrawnLetter.push('B');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 25 && ballNumber <= 50) {
      letter = 'I';
      ballDrawnLetter.push('I');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 51 && ballNumber <= 75) {
      letter = 'N';
      ballDrawnLetter.push('N');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 76 && ballNumber <= 100) {
      letter = 'G';
      ballDrawnLetter.push('G');
      ballDrawnNumber.push(ballNumber);
    } else if (ballNumber >= 101 && ballNumber <= 125) {
      letter = 'O';
      ballDrawnLetter.push('O');
      ballDrawnNumber.push(ballNumber);
    }
  } else {
    //ballNumber = 1 * Math.floor(Math.random() * 125);
    ballNumber = 0;
    letter = 'NA';
  }
  repeat = 0;
  return letter + '-' + ballNumber;
}
