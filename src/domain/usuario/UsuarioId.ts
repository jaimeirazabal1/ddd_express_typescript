import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '../../shared/domain/ValueObject';
import { InvalidArgumentError } from '../../shared/domain/DomainError';

/**
 * 🎯 VALUE OBJECT: UsuarioId
 * 
 * Identifica únicamente a un usuario en el sistema.
 */

export class UsuarioId extends ValueObject<string> {
  
  constructor(value: string) {
    super(value);
  }

  /**
   * Crea un nuevo ID único para un usuario
   */
  public static create(): UsuarioId {
    return new UsuarioId(uuidv4());
  }

  /**
   * Crea un UsuarioId desde un string existente
   */
  public static fromString(id: string): UsuarioId {
    return new UsuarioId(id);
  }

  /**
   * Validación del formato UUID
   */
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidArgumentError('El ID del usuario no puede estar vacío');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new InvalidArgumentError('El ID del usuario debe tener formato UUID válido');
    }
  }
} 