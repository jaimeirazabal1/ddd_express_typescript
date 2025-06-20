import { Entity } from '../../shared/domain/Entity';
import { InvalidArgumentError } from '../../shared/domain/DomainError';
import { UsuarioId } from './UsuarioId';
import { Email } from './Email';

/**
 * 🎯 ENTIDAD: Usuario
 * 
 * Representa un usuario de la biblioteca que puede:
 * - Tomar libros prestados
 * - Hacer reservas
 * - Tener un historial de préstamos
 */

export enum TipoUsuario {
  ESTUDIANTE = 'estudiante',
  PROFESOR = 'profesor',
  ADMINISTRATIVO = 'administrativo',
  EXTERNO = 'externo'
}

export class Usuario extends Entity<UsuarioId> {
  private _nombre: string;
  private _apellido: string;
  private _email: Email;
  private _tipo: TipoUsuario;
  private _fechaRegistro: Date;
  private _activo: boolean;

  constructor(
    id: UsuarioId,
    nombre: string,
    apellido: string,
    email: Email,
    tipo: TipoUsuario,
    fechaRegistro?: Date,
    activo: boolean = true
  ) {
    super(id);
    this.validarNombre(nombre);
    this.validarApellido(apellido);
    
    this._nombre = nombre.trim();
    this._apellido = apellido.trim();
    this._email = email;
    this._tipo = tipo;
    this._fechaRegistro = fechaRegistro || new Date();
    this._activo = activo;
  }

  // ===== FACTORY METHODS =====

  /**
   * Crea un nuevo usuario
   */
  public static crear(
    nombre: string,
    apellido: string,
    email: string,
    tipo: TipoUsuario
  ): Usuario {
    return new Usuario(
      UsuarioId.create(),
      nombre,
      apellido,
      new Email(email),
      tipo
    );
  }

  /**
   * Reconstituye un usuario desde datos persistidos
   */
  public static reconstituir(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    tipo: TipoUsuario,
    fechaRegistro: Date,
    activo: boolean
  ): Usuario {
    return new Usuario(
      UsuarioId.fromString(id),
      nombre,
      apellido,
      new Email(email),
      tipo,
      fechaRegistro,
      activo
    );
  }

  // ===== GETTERS =====

  public get nombre(): string {
    return this._nombre;
  }

  public get apellido(): string {
    return this._apellido;
  }

  public get email(): Email {
    return this._email;
  }

  public get tipo(): TipoUsuario {
    return this._tipo;
  }

  public get fechaRegistro(): Date {
    return this._fechaRegistro;
  }

  public get activo(): boolean {
    return this._activo;
  }

  // ===== MÉTODOS DE NEGOCIO =====

  /**
   * Actualiza el email del usuario
   */
  public actualizarEmail(nuevoEmail: string): void {
    this._email = new Email(nuevoEmail);
  }

  /**
   * Desactiva el usuario
   */
  public desactivar(): void {
    this._activo = false;
  }

  /**
   * Reactiva el usuario
   */
  public reactivar(): void {
    this._activo = true;
  }

  /**
   * Obtiene el nombre completo
   */
  public nombreCompleto(): string {
    return `${this._nombre} ${this._apellido}`;
  }

  /**
   * Obtiene las iniciales
   */
  public iniciales(): string {
    return `${this._nombre.charAt(0).toUpperCase()}${this._apellido.charAt(0).toUpperCase()}`;
  }

  /**
   * Verifica si puede tomar libros prestados
   */
  public puedeTomarPrestamos(): boolean {
    return this._activo;
  }

  /**
   * Obtiene el límite de libros según el tipo de usuario
   */
  public limiteDePrestamos(): number {
    switch (this._tipo) {
      case TipoUsuario.ESTUDIANTE:
        return 3;
      case TipoUsuario.PROFESOR:
        return 10;
      case TipoUsuario.ADMINISTRATIVO:
        return 5;
      case TipoUsuario.EXTERNO:
        return 1;
      default:
        return 1;
    }
  }

  /**
   * Obtiene los días máximos de préstamo según el tipo
   */
  public diasMaximoPrestamo(): number {
    switch (this._tipo) {
      case TipoUsuario.ESTUDIANTE:
        return 14; // 2 semanas
      case TipoUsuario.PROFESOR:
        return 30; // 1 mes
      case TipoUsuario.ADMINISTRATIVO:
        return 21; // 3 semanas
      case TipoUsuario.EXTERNO:
        return 7;  // 1 semana
      default:
        return 7;
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  private validarNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0) {
      throw new InvalidArgumentError('El nombre no puede estar vacío');
    }

    if (nombre.trim().length < 2) {
      throw new InvalidArgumentError('El nombre debe tener al menos 2 caracteres');
    }

    if (nombre.length > 50) {
      throw new InvalidArgumentError('El nombre no puede exceder 50 caracteres');
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
      throw new InvalidArgumentError('El nombre solo puede contener letras y espacios');
    }
  }

  private validarApellido(apellido: string): void {
    if (!apellido || apellido.trim().length === 0) {
      throw new InvalidArgumentError('El apellido no puede estar vacío');
    }

    if (apellido.trim().length < 2) {
      throw new InvalidArgumentError('El apellido debe tener al menos 2 caracteres');
    }

    if (apellido.length > 50) {
      throw new InvalidArgumentError('El apellido no puede exceder 50 caracteres');
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(apellido)) {
      throw new InvalidArgumentError('El apellido solo puede contener letras y espacios');
    }
  }
} 