/**
 * 🎯 ERRORES DE DOMINIO
 * 
 * Los errores de dominio representan violaciones de reglas de negocio.
 * Son diferentes de los errores técnicos porque están relacionados
 * con el comportamiento esperado del sistema.
 */

export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error cuando se intenta crear un objeto con datos inválidos
 */
export class InvalidArgumentError extends DomainError {
  constructor(message: string) {
    super(`Argumento inválido: ${message}`);
  }
}

/**
 * Error cuando no se encuentra un recurso
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} con ID ${id} no encontrado`);
  }
}

/**
 * Error cuando se viola una regla de negocio
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(`Regla de negocio violada: ${message}`);
  }
} 