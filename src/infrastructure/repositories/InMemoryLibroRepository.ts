import { Libro } from '../../domain/libro/Libro';
import { LibroId } from '../../domain/libro/LibroId';
import { ISBN } from '../../domain/libro/ISBN';
import { LibroRepository } from '../../domain/libro/LibroRepository';
import { EstadoLibro } from '../../domain/libro/EstadoLibro';

/**
 * 🎯 IMPLEMENTACIÓN: InMemoryLibroRepository
 * 
 * Esta es una implementación EN MEMORIA del repositorio de libros.
 * En un proyecto real, aquí tendríamos implementaciones con:
 * - Base de datos SQL (PostgreSQL, MySQL)
 * - Base de datos NoSQL (MongoDB)
 * - APIs externas
 * 
 * La implementación en memoria es perfecta para:
 * - Desarrollo y testing
 * - Demostraciones
 * - Prototipado rápido
 */

export class InMemoryLibroRepository implements LibroRepository {
  private libros: Map<string, Libro> = new Map();

  constructor() {
    // Crear algunos libros de ejemplo para la demostración
    this.cargarDatosDeEjemplo();
  }

  /**
   * Guarda un libro (crear o actualizar)
   */
  async guardar(libro: Libro): Promise<void> {
    this.libros.set(libro.id.value, libro);
  }

  /**
   * Busca un libro por su ID
   */
  async buscarPorId(id: LibroId): Promise<Libro | null> {
    return this.libros.get(id.value) || null;
  }

  /**
   * Busca un libro por su ISBN
   */
  async buscarPorISBN(isbn: ISBN): Promise<Libro | null> {
    for (const libro of this.libros.values()) {
      if (libro.isbn.equals(isbn)) {
        return libro;
      }
    }
    return null;
  }

  /**
   * Busca libros por título (búsqueda parcial)
   */
  async buscarPorTitulo(titulo: string): Promise<Libro[]> {
    const tituloLower = titulo.toLowerCase();
    const resultados: Libro[] = [];

    for (const libro of this.libros.values()) {
      if (libro.titulo.value.toLowerCase().includes(tituloLower)) {
        resultados.push(libro);
      }
    }

    return resultados;
  }

  /**
   * Busca libros por autor
   */
  async buscarPorAutor(autor: string): Promise<Libro[]> {
    const autorLower = autor.toLowerCase();
    const resultados: Libro[] = [];

    for (const libro of this.libros.values()) {
      if (libro.autor.value.toLowerCase().includes(autorLower)) {
        resultados.push(libro);
      }
    }

    return resultados;
  }

  /**
   * Obtiene todos los libros disponibles
   */
  async obtenerDisponibles(): Promise<Libro[]> {
    const resultados: Libro[] = [];

    for (const libro of this.libros.values()) {
      if (libro.estaDisponible()) {
        resultados.push(libro);
      }
    }

    return resultados;
  }

  /**
   * Obtiene todos los libros
   */
  async obtenerTodos(): Promise<Libro[]> {
    return Array.from(this.libros.values());
  }

  /**
   * Elimina un libro
   */
  async eliminar(id: LibroId): Promise<void> {
    this.libros.delete(id.value);
  }

  /**
   * Verifica si existe un libro con el ISBN dado
   */
  async existeISBN(isbn: ISBN): Promise<boolean> {
    const libro = await this.buscarPorISBN(isbn);
    return libro !== null;
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Carga datos de ejemplo para demostración
   */
  private cargarDatosDeEjemplo(): void {
    const librosEjemplo = [
      {
        titulo: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        autor: 'Robert C. Martin',
        isbn: '978-0132350884'
      },
      {
        titulo: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
        autor: 'Eric Evans',
        isbn: '978-0321125217'
      },
      {
        titulo: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        autor: 'Gang of Four',
        isbn: '978-0201633610'
      },
      {
        titulo: 'The Pragmatic Programmer',
        autor: 'Andrew Hunt, David Thomas',
        isbn: '978-0135957059'
      },
      {
        titulo: 'Refactoring: Improving the Design of Existing Code',
        autor: 'Martin Fowler',
        isbn: '978-0134757599'
      }
    ];

    librosEjemplo.forEach(ejemplo => {
      const libro = Libro.crear(ejemplo.titulo, ejemplo.autor, ejemplo.isbn);
      this.libros.set(libro.id.value, libro);
    });
  }

  /**
   * Método utilitario para testing: limpiar todos los datos
   */
  public limpiar(): void {
    this.libros.clear();
  }

  /**
   * Método utilitario para testing: obtener cantidad de libros
   */
  public contar(): number {
    return this.libros.size;
  }
} 