import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: Autor
 * 
 * Representa el autor de un libro.
 * En un sistema más complejo, Autor podría ser una entidad separada,
 * pero para este ejemplo lo modelamos como Value Object.
 */

export class Autor extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Validaciones para el nombre del autor
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El nombre del autor no puede estar vacío');
    }

    if (value.trim().length < 2) {
      throw new InvalidArgumentError('El nombre del autor debe tener al menos 2 caracteres');
    }

    if (value.length > 100) {
      throw new InvalidArgumentError('El nombre del autor no puede exceder 100 caracteres');
    }

    // Debe contener al menos una letra
    if (!/[a-zA-ZÀ-ÿ]/.test(value)) {
      throw new InvalidArgumentError('El nombre del autor debe contener al menos una letra');
    }
  }

  /**
   * Formatea el nombre del autor
   */
  public formatted(): string {
    return this._value
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Obtiene las iniciales del autor
   */
  public initials(): string {
    return this._value
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
} 