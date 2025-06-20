import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: ISBN
 * 
 * El ISBN (International Standard Book Number) es un identificador único
 * para libros que tiene reglas de validación específicas.
 * 
 * Es un excelente ejemplo de Value Object porque:
 * - Tiene validaciones complejas específicas del dominio
 * - Es inmutable
 * - Su valor define completamente al objeto
 */

export class ISBN extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Validación del formato ISBN-10 o ISBN-13
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El ISBN no puede estar vacío');
    }

    // Remover guiones y espacios para validación
    const cleanISBN = value.replace(/[-\s]/g, '');

    if (cleanISBN.length === 10) {
      this.validateISBN10(cleanISBN);
    } else if (cleanISBN.length === 13) {
      this.validateISBN13(cleanISBN);
    } else {
      throw new InvalidArgumentError('El ISBN debe tener 10 o 13 dígitos');
    }
  }

  /**
   * Validación específica para ISBN-10
   */
  private validateISBN10(isbn: string): void {
    if (!/^\d{9}[\dX]$/.test(isbn)) {
      throw new InvalidArgumentError('Formato ISBN-10 inválido');
    }

    // Algoritmo de validación ISBN-10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(isbn[i]) * (10 - i);
    }

    const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
    sum += checkDigit;

    if (sum % 11 !== 0) {
      throw new InvalidArgumentError('Dígito de verificación ISBN-10 inválido');
    }
  }

  /**
   * Validación específica para ISBN-13
   */
  private validateISBN13(isbn: string): void {
    if (!/^\d{13}$/.test(isbn)) {
      throw new InvalidArgumentError('Formato ISBN-13 inválido');
    }

    // Algoritmo de validación ISBN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }

    const checkDigit = parseInt(isbn[12]);
    const calculatedCheck = (10 - (sum % 10)) % 10;

    if (checkDigit !== calculatedCheck) {
      throw new InvalidArgumentError('Dígito de verificación ISBN-13 inválido');
    }
  }

  /**
   * Formatea el ISBN con guiones para mejor lectura
   */
  public formatted(): string {
    const clean = this._value.replace(/[-\s]/g, '');
    
    if (clean.length === 10) {
      return `${clean.substring(0, 1)}-${clean.substring(1, 5)}-${clean.substring(5, 9)}-${clean.substring(9)}`;
    } else {
      return `${clean.substring(0, 3)}-${clean.substring(3, 4)}-${clean.substring(4, 6)}-${clean.substring(6, 12)}-${clean.substring(12)}`;
    }
  }
} 