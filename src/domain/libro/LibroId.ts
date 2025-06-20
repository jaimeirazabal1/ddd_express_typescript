import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: LibroId
 * 
 * Encapsula la identidad de un libro.
 * Aunque es un ID, lo modelamos como Value Object porque:
 * - Es inmutable
 * - Tiene validaciones específicas
 * - Encapsula la lógica de generación de IDs
 */

export class LibroId extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Crea un nuevo ID único para un libro
   */
  public static create(): LibroId {
    return new LibroId(uuidv4());
  }

  /**
   * Crea un LibroId desde un string existente
   */
  public static fromString(id: string): LibroId {
    return new LibroId(id);
  }

  /**
   * Validación del formato UUID
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El ID del libro no puede estar vacío');
    }

    // Validación básica de formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new InvalidArgumentError('El ID del libro debe tener formato UUID válido');
    }
  }
} 