export function generateId(n) {
  var add = 1,
    max = 10 - add;

  if (n > max) {
    return generateId(max) + generateId(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
}

export function generateOwnReferalNumber(n) {
  var add = 1,
    max = 6 - add;

  if (n > max) {
    return generateOwnReferalNumber(max) + generateOwnReferalNumber(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
}

export function generatePaymentNumber(n) {
  var add = 1,
    max = 8 - add;

  if (n > max) {
    return generatePaymentNumber(max) + generatePaymentNumber(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
}
