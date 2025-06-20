import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: Email
 * 
 * Encapsula un email con todas sus validaciones.
 * Es un excelente ejemplo de Value Object porque:
 * - Tiene reglas de validación complejas
 * - Es inmutable
 * - Se identifica por su valor, no por identidad
 */

export class Email extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Validación de formato de email
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El email no puede estar vacío');
    }

    const emailTrimmed = value.trim().toLowerCase();

    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      throw new InvalidArgumentError('Formato de email inválido');
    }

    // Validaciones adicionales
    if (emailTrimmed.length > 254) {
      throw new InvalidArgumentError('El email no puede exceder 254 caracteres');
    }

    const [localPart, domain] = emailTrimmed.split('@');
    
    if (localPart.length > 64) {
      throw new InvalidArgumentError('La parte local del email no puede exceder 64 caracteres');
    }

    if (domain.length > 253) {
      throw new InvalidArgumentError('El dominio del email no puede exceder 253 caracteres');
    }

    // No permitir ciertos caracteres peligrosos
    if (/[<>"]/.test(emailTrimmed)) {
      throw new InvalidArgumentError('El email contiene caracteres no permitidos');
    }
  }

  /**
   * Devuelve el email en formato normalizado (lowercase, trimmed)
   */
  public normalized(): string {
    return this._value.trim().toLowerCase();
  }

  /**
   * Obtiene la parte local del email (antes del @)
   */
  public localPart(): string {
    return this.normalized().split('@')[0];
  }

  /**
   * Obtiene el dominio del email (después del @)
   */
  public domain(): string {
    return this.normalized().split('@')[1];
  }

  /**
   * Verifica si es un email de un dominio específico
   */
  public esDelDominio(dominio: string): boolean {
    return this.domain() === dominio.toLowerCase();
  }
} 