import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: Titulo
 * 
 * Aunque un título podría ser simplemente un string,
 * lo modelamos como Value Object para:
 * - Encapsular validaciones de negocio
 * - Centralizar la lógica de formato
 * - Hacer explícitas las reglas del dominio
 */

export class Titulo extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Validaciones específicas para el título de un libro
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El título no puede estar vacío');
    }

    if (value.trim().length < 2) {
      throw new InvalidArgumentError('El título debe tener al menos 2 caracteres');
    }

    if (value.length > 200) {
      throw new InvalidArgumentError('El título no puede exceder 200 caracteres');
    }

    // No permitir solo números o caracteres especiales
    if (!/[a-zA-ZÀ-ÿ]/.test(value)) {
      throw new InvalidArgumentError('El título debe contener al menos una letra');
    }
  }

  /**
   * Devuelve el título formateado (capitalizado correctamente)
   */
  public formatted(): string {
    return this._value
      .trim()
      .split(' ')
      .map(word => {
        // Palabras cortas que no se capitalizan (excepto al inicio)
        const lowercaseWords = ['de', 'la', 'el', 'y', 'o', 'en', 'a', 'con', 'por', 'para'];
        
        if (lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      // Asegurar que la primera palabra esté capitalizada
      .replace(/^./, match => match.toUpperCase());
  }

  /**
   * Versión abreviada del título (útil para listados)
   */
  public abbreviated(maxLength: number = 50): string {
    const formatted = this.formatted();
    if (formatted.length <= maxLength) {
      return formatted;
    }
    
    return formatted.substring(0, maxLength - 3) + '...';
  }
} 