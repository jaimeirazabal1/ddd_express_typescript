import { Libro } from './Libro';
import { LibroId } from './LibroId';
import { ISBN } from './ISBN';

/**
 * 🎯 REPOSITORY INTERFACE: LibroRepository
 * 
 * En DDD, los repositorios son abstracciones que:
 * - Pertenecen al DOMINIO (no a la infraestructura)
 * - Definen CÓMO el dominio quiere persistir/recuperar agregados
 * - Permiten que el dominio ignore los detalles de persistencia
 * - Se implementan en la capa de infraestructura
 */

export interface LibroRepository {
  /**
   * Guarda un libro (crear o actualizar)
   */
  guardar(libro: Libro): Promise<void>;

  /**
   * Busca un libro por su ID
   */
  buscarPorId(id: LibroId): Promise<Libro | null>;

  /**
   * Busca un libro por su ISBN
   */
  buscarPorISBN(isbn: ISBN): Promise<Libro | null>;

  /**
   * Busca libros por título (búsqueda parcial)
   */
  buscarPorTitulo(titulo: string): Promise<Libro[]>;

  /**
   * Busca libros por autor
   */
  buscarPorAutor(autor: string): Promise<Libro[]>;

  /**
   * Obtiene todos los libros disponibles
   */
  obtenerDisponibles(): Promise<Libro[]>;

  /**
   * Obtiene todos los libros
   */
  obtenerTodos(): Promise<Libro[]>;

  /**
   * Elimina un libro
   */
  eliminar(id: LibroId): Promise<void>;

  /**
   * Verifica si existe un libro con el ISBN dado
   */
  existeISBN(isbn: ISBN): Promise<boolean>;
} 