import { Entity } from '../../shared/domain/Entity';
import { BusinessRuleError } from '../../shared/domain/DomainError';
import { LibroId } from './LibroId';
import { Titulo } from './Titulo';
import { Autor } from './Autor';
import { ISBN } from './ISBN';
import { EstadoLibro, EstadoLibroUtils } from './EstadoLibro';

/**
 * 🎯 ENTIDAD: Libro
 * 
 * Es una entidad porque:
 * - Tiene identidad única (LibroId)
 * - Su identidad persiste en el tiempo
 * - Puede cambiar de estado manteniendo su identidad
 * - Encapsula reglas de negocio importantes
 */

export class Libro extends Entity<LibroId> {
  private _titulo: Titulo;
  private _autor: Autor;
  private _isbn: ISBN;
  private _estado: EstadoLibro;
  private _fechaIngreso: Date;
  private _fechaUltimaActualizacion: Date;

  constructor(
    id: LibroId,
    titulo: Titulo,
    autor: Autor,
    isbn: ISBN,
    estado: EstadoLibro = EstadoLibro.DISPONIBLE,
    fechaIngreso?: Date
  ) {
    super(id);
    this._titulo = titulo;
    this._autor = autor;
    this._isbn = isbn;
    this._estado = estado;
    this._fechaIngreso = fechaIngreso || new Date();
    this._fechaUltimaActualizacion = new Date();
  }

  // ===== FACTORY METHODS =====

  /**
   * Crea un nuevo libro (método de fábrica)
   */
  public static crear(titulo: string, autor: string, isbn: string): Libro {
    return new Libro(
      LibroId.create(),
      new Titulo(titulo),
      new Autor(autor),
      new ISBN(isbn)
    );
  }

  /**
   * Reconstituye un libro desde datos persistidos
   */
  public static reconstituir(
    id: string,
    titulo: string,
    autor: string,
    isbn: string,
    estado: EstadoLibro,
    fechaIngreso: Date,
    fechaUltimaActualizacion: Date
  ): Libro {
    const libro = new Libro(
      LibroId.fromString(id),
      new Titulo(titulo),
      new Autor(autor),
      new ISBN(isbn),
      estado,
      fechaIngreso
    );
    libro._fechaUltimaActualizacion = fechaUltimaActualizacion;
    return libro;
  }

  // ===== GETTERS =====

  public get titulo(): Titulo {
    return this._titulo;
  }

  public get autor(): Autor {
    return this._autor;
  }

  public get isbn(): ISBN {
    return this._isbn;
  }

  public get estado(): EstadoLibro {
    return this._estado;
  }

  public get fechaIngreso(): Date {
    return this._fechaIngreso;
  }

  public get fechaUltimaActualizacion(): Date {
    return this._fechaUltimaActualizacion;
  }

  // ===== MÉTODOS DE NEGOCIO =====

  /**
   * Marca el libro como prestado
   * REGLA DE NEGOCIO: Solo se puede prestar si está disponible o reservado
   */
  public prestar(): void {
    if (!EstadoLibroUtils.puedeSerPrestado(this._estado)) {
      throw new BusinessRuleError(
        `No se puede prestar el libro "${this._titulo.value}" porque está ${this._estado}`
      );
    }

    this.cambiarEstado(EstadoLibro.PRESTADO);
  }

  /**
   * Marca el libro como devuelto (disponible)
   * REGLA DE NEGOCIO: Solo se puede devolver si está prestado
   */
  public devolver(): void {
    if (this._estado !== EstadoLibro.PRESTADO) {
      throw new BusinessRuleError(
        `No se puede devolver el libro "${this._titulo.value}" porque no está prestado`
      );
    }

    this.cambiarEstado(EstadoLibro.DISPONIBLE);
  }

  /**
   * Reserva el libro
   * REGLA DE NEGOCIO: Solo se puede reservar si está disponible
   */
  public reservar(): void {
    if (!EstadoLibroUtils.puedeSerReservado(this._estado)) {
      throw new BusinessRuleError(
        `No se puede reservar el libro "${this._titulo.value}" porque está ${this._estado}`
      );
    }

    this.cambiarEstado(EstadoLibro.RESERVADO);
  }

  /**
   * Cancela la reserva del libro
   */
  public cancelarReserva(): void {
    if (this._estado !== EstadoLibro.RESERVADO) {
      throw new BusinessRuleError(
        `No se puede cancelar la reserva porque el libro no está reservado`
      );
    }

    this.cambiarEstado(EstadoLibro.DISPONIBLE);
  }

  /**
   * Pone el libro en mantenimiento
   */
  public ponerEnMantenimiento(): void {
    if (this._estado === EstadoLibro.PRESTADO) {
      throw new BusinessRuleError(
        `No se puede poner en mantenimiento un libro que está prestado`
      );
    }

    this.cambiarEstado(EstadoLibro.EN_MANTENIMIENTO);
  }

  /**
   * Reporta el libro como perdido
   */
  public reportarPerdido(): void {
    this.cambiarEstado(EstadoLibro.PERDIDO);
  }

  /**
   * Da de baja el libro
   */
  public darDeBaja(): void {
    if (this._estado === EstadoLibro.PRESTADO) {
      throw new BusinessRuleError(
        `No se puede dar de baja un libro que está prestado`
      );
    }

    this.cambiarEstado(EstadoLibro.DADO_DE_BAJA);
  }

  // ===== MÉTODOS DE CONSULTA =====

  /**
   * Verifica si el libro está disponible para préstamo
   */
  public estaDisponible(): boolean {
    return EstadoLibroUtils.puedeSerPrestado(this._estado);
  }

  /**
   * Verifica si el libro está prestado
   */
  public estaPrestado(): boolean {
    return this._estado === EstadoLibro.PRESTADO;
  }

  /**
   * Obtiene información básica del libro
   */
  public informacionBasica(): string {
    return `"${this._titulo.formatted()}" por ${this._autor.formatted()} (${this._isbn.formatted()})`;
  }

  // ===== MÉTODOS PRIVADOS =====

  /**
   * Cambia el estado del libro validando las transiciones
   */
  private cambiarEstado(nuevoEstado: EstadoLibro): void {
    if (!EstadoLibroUtils.esTransicionValida(this._estado, nuevoEstado)) {
      throw new BusinessRuleError(
        `Transición de estado inválida: de ${this._estado} a ${nuevoEstado}`
      );
    }

    this._estado = nuevoEstado;
    this._fechaUltimaActualizacion = new Date();
  }
} 