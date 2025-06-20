/**
 * 🎯 CLASE BASE PARA VALUE OBJECTS
 * 
 * En DDD, un Value Object es un objeto que:
 * - NO tiene identidad propia
 * - Es inmutable (no se puede cambiar después de crearse)
 * - Su igualdad se basa en sus atributos, no en identidad
 * - Encapsula validaciones y lógica relacionada con el valor
 */

export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  /**
   * Validación del valor - debe ser implementada por cada Value Object
   */
  protected abstract validate(value: T): void;

  /**
   * Getter para acceder al valor
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Dos Value Objects son iguales si sus valores son iguales
   */
  public equals(vo: ValueObject<T>): boolean {
    if (!vo || vo.constructor !== this.constructor) {
      return false;
    }

    return JSON.stringify(this._value) === JSON.stringify(vo._value);
  }

  /**
   * Representación en string del valor
   */
  public toString(): string {
    return String(this._value);
  }
} 