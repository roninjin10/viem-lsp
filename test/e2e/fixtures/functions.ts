/**
 * Adds two numbers together.
 * @param a The first number
 * @param b The second number
 * @returns The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * Multiplies two numbers.
 * @param x The first number
 * @param y The second number
 * @returns The product of x and y
 */
export function multiply(x: number, y: number): number {
  return x * y
}

export class Calculator {
  private value: number = 0

  constructor(initialValue: number = 0) {
    this.value = initialValue
  }

  add(n: number): this {
    this.value += n
    return this
  }

  subtract(n: number): this {
    this.value -= n
    return this
  }

  getValue(): number {
    return this.value
  }
}

// Usage example
const calc = new Calculator(10)
const result = calc.add(5).subtract(3).getValue()
console.log(result) // 12

const sum = add(1, 2)
const product = multiply(3, 4)
