/**
 * 🎯 COMMAND: CrearLibroCommand
 * 
 * En DDD/CQRS, los Commands representan intenciones de cambio.
 * Son simples DTOs que encapsulan toda la información necesaria
 * para ejecutar una operación de escritura.
 */

export class CrearLibroCommand {
  constructor(
    public readonly titulo: string,
    public readonly autor: string,
    public readonly isbn: string
  ) {}

  /**
   * Validación básica del comando
   */
  public validar(): string[] {
    const errores: string[] = [];

    if (!this.titulo || this.titulo.trim().length === 0) {
      errores.push('El título es requerido');
    }

    if (!this.autor || this.autor.trim().length === 0) {
      errores.push('El autor es requerido');
    }

    if (!this.isbn || this.isbn.trim().length === 0) {
      errores.push('El ISBN es requerido');
    }

    return errores;
  }

  /**
   * Verifica si el comando es válido
   */
  public esValido(): boolean {
    return this.validar().length === 0;
  }
} 