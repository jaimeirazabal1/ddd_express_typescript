/**
 * 🎯 ENUM: EstadoLibro
 * 
 * Representa los posibles estados de un libro en la biblioteca.
 * Es importante modelar explícitamente los estados para:
 * - Hacer claras las transiciones válidas
 * - Encapsular las reglas de negocio
 * - Evitar estados inválidos
 */

export enum EstadoLibro {
  DISPONIBLE = 'disponible',
  PRESTADO = 'prestado',
  RESERVADO = 'reservado',
  EN_MANTENIMIENTO = 'en_mantenimiento',
  PERDIDO = 'perdido',
  DADO_DE_BAJA = 'dado_de_baja'
}

/**
 * Clase utilitaria para trabajar con estados de libro
 */
export class EstadoLibroUtils {
  
  /**
   * Verifica si un libro puede ser prestado
   */
  public static puedeSerPrestado(estado: EstadoLibro): boolean {
    return estado === EstadoLibro.DISPONIBLE || estado === EstadoLibro.RESERVADO;
  }

  /**
   * Verifica si un libro puede ser reservado
   */
  public static puedeSerReservado(estado: EstadoLibro): boolean {
    return estado === EstadoLibro.DISPONIBLE;
  }

  /**
   * Obtiene las transiciones válidas desde un estado
   */
  public static transicionesValidas(desde: EstadoLibro): EstadoLibro[] {
    switch (desde) {
      case EstadoLibro.DISPONIBLE:
        return [EstadoLibro.PRESTADO, EstadoLibro.RESERVADO, EstadoLibro.EN_MANTENIMIENTO];
      
      case EstadoLibro.PRESTADO:
        return [EstadoLibro.DISPONIBLE, EstadoLibro.PERDIDO, EstadoLibro.EN_MANTENIMIENTO];
      
      case EstadoLibro.RESERVADO:
        return [EstadoLibro.PRESTADO, EstadoLibro.DISPONIBLE];
      
      case EstadoLibro.EN_MANTENIMIENTO:
        return [EstadoLibro.DISPONIBLE, EstadoLibro.DADO_DE_BAJA];
      
      case EstadoLibro.PERDIDO:
        return [EstadoLibro.DADO_DE_BAJA, EstadoLibro.DISPONIBLE]; // Si se encuentra
      
      case EstadoLibro.DADO_DE_BAJA:
        return []; // Estado final
      
      default:
        return [];
    }
  }

  /**
   * Verifica si una transición es válida
   */
  public static esTransicionValida(desde: EstadoLibro, hacia: EstadoLibro): boolean {
    return this.transicionesValidas(desde).includes(hacia);
  }

  /**
   * Descripción humana del estado
   */
  public static descripcion(estado: EstadoLibro): string {
    switch (estado) {
      case EstadoLibro.DISPONIBLE:
        return 'Disponible para préstamo';
      case EstadoLibro.PRESTADO:
        return 'Actualmente prestado';
      case EstadoLibro.RESERVADO:
        return 'Reservado por un usuario';
      case EstadoLibro.EN_MANTENIMIENTO:
        return 'En mantenimiento';
      case EstadoLibro.PERDIDO:
        return 'Reportado como perdido';
      case EstadoLibro.DADO_DE_BAJA:
        return 'Dado de baja del sistema';
      default:
        return 'Estado desconocido';
    }
  }
} 