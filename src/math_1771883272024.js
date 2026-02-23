class MathHelper {
  static add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Both arguments must be numbers');
    }
    return a + b;
  }

  static subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Both arguments must be numbers');
    }
    return a - b;
  }

  static multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Both arguments must be numbers');
    }
    return a * b;
  }

  static divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Both arguments must be numbers');
    }
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  static power(base, exponent) {
    if (typeof base !== 'number' || typeof exponent !== 'number') {
      throw new TypeError('Both base and exponent must be numbers');
    }
    return Math.pow(base, exponent);
  }

  static squareRoot(num) {
    if (typeof num !== 'number') {
      throw new TypeError('Argument must be a number');
    }
    if (num < 0) {
      throw new Error('Cannot calculate square root of a negative number');
    }
    return Math.sqrt(num);
  }

  static absolute(num) {
    if (typeof num !== 'number') {
      throw new TypeError('Argument must be a number');
    }
    return Math.abs(num);
  }

  static round(num, decimals = 0) {
    if (typeof num !== 'number') {
      throw new TypeError('First argument must be a number');
    }
    if (typeof decimals !== 'number' || decimals < 0 || !Number.isInteger(decimals)) {
      throw new TypeError('Decimals must be a non-negative integer');
    }
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  static floor(num) {
    if (typeof num !== 'number') {
      throw new TypeError('Argument must be a number');
    }
    return Math.floor(num);
  }

  static ceil(num) {
    if (typeof num !== 'number') {
      throw new TypeError('Argument must be a number');
    }
    return Math.ceil(num);
  }

  static max(...numbers) {
    if (numbers.length === 0) {
      throw new Error('At least one number must be provided');
    }
    if (!numbers.every(num => typeof num === 'number')) {
      throw new TypeError('All arguments must be numbers');
    }
    return Math.max(...numbers);
  }

  static min(...numbers) {
    if (numbers.length === 0) {
      throw new Error('At least one number must be provided');
    }
    if (!numbers.every(num => typeof num === 'number