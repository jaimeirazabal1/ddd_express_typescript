import { Libro } from '../../domain/libro/Libro';
import { LibroRepository } from '../../domain/libro/LibroRepository';
import { ISBN } from '../../domain/libro/ISBN';
import { CrearLibroCommand } from './CrearLibroCommand';
import { BusinessRuleError } from '../../shared/domain/DomainError';

/**
 * 🎯 USE CASE: CrearLibroUseCase
 * 
 * Los casos de uso representan las operaciones que el sistema puede realizar.
 * Son el punto de entrada a la lógica de negocio y orquestan:
 * - Validaciones de aplicación
 * - Interacciones con repositorios
 * - Coordinación entre agregados
 * - Reglas de negocio transversales
 */

export class CrearLibroUseCase {
  constructor(
    private readonly libroRepository: LibroRepository
  ) {}

  /**
   * Ejecuta el caso de uso de crear un libro
   */
  public async ejecutar(command: CrearLibroCommand): Promise<string> {
    // 1. Validar el comando
    if (!command.esValido()) {
      const errores = command.validar().join(', ');
      throw new BusinessRuleError(`Datos inválidos: ${errores}`);
    }

    // 2. Verificar que no existe un libro con el mismo ISBN
    const isbn = new ISBN(command.isbn);
    const libroExistente = await this.libroRepository.buscarPorISBN(isbn);
    
    if (libroExistente) {
      throw new BusinessRuleError(
        `Ya existe un libro con el ISBN ${isbn.formatted()}`
      );
    }

    // 3. Crear el nuevo libro usando el factory method del dominio
    const nuevoLibro = Libro.crear(
      command.titulo,
      command.autor,
      command.isbn
    );

    // 4. Persistir el libro
    await this.libroRepository.guardar(nuevoLibro);

    // 5. Retornar el ID del libro creado
    return nuevoLibro.id.value;
  }
} 