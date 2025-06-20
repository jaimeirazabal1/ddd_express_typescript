import { Request, Response } from 'express';
import { CrearLibroUseCase } from '../../application/libro/CrearLibroUseCase';
import { CrearLibroCommand } from '../../application/libro/CrearLibroCommand';
import { LibroRepository } from '../../domain/libro/LibroRepository';
import { LibroId } from '../../domain/libro/LibroId';
import { DomainError } from '../../shared/domain/DomainError';

/**
 * 🎯 CONTROLADOR: LibroController
 * 
 * El controlador REST es parte de la capa de presentación.
 * Sus responsabilidades son:
 * - Validar datos de entrada (HTTP)
 * - Convertir datos HTTP a comandos/queries
 * - Invocar casos de uso
 * - Convertir respuestas de dominio a HTTP
 * - Manejar errores de manera apropiada
 */

export class LibroController {
  constructor(
    private readonly crearLibroUseCase: CrearLibroUseCase,
    private readonly libroRepository: LibroRepository
  ) {}

  /**
   * POST /api/libros - Crear un nuevo libro
   */
  public crearLibro = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Extraer datos del request
      const { titulo, autor, isbn } = req.body;

      // 2. Crear el comando
      const command = new CrearLibroCommand(titulo, autor, isbn);

      // 3. Ejecutar el caso de uso
      const libroId = await this.crearLibroUseCase.ejecutar(command);

      // 4. Responder con éxito
      res.status(201).json({
        success: true,
        message: 'Libro creado exitosamente',
        data: {
          id: libroId
        }
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * GET /api/libros - Obtener todos los libros
   */
  public obtenerLibros = async (req: Request, res: Response): Promise<void> => {
    try {
      const libros = await this.libroRepository.obtenerTodos();
      
      const librosDTO = libros.map(libro => ({
        id: libro.id.value,
        titulo: libro.titulo.formatted(),
        autor: libro.autor.formatted(),
        isbn: libro.isbn.formatted(),
        estado: libro.estado,
        informacionBasica: libro.informacionBasica(),
        estaDisponible: libro.estaDisponible(),
        fechaIngreso: libro.fechaIngreso.toISOString()
      }));

      res.json({
        success: true,
        data: librosDTO,
        total: librosDTO.length
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * GET /api/libros/disponibles - Obtener libros disponibles
   */
  public obtenerLibrosDisponibles = async (req: Request, res: Response): Promise<void> => {
    try {
      const libros = await this.libroRepository.obtenerDisponibles();
      
      const librosDTO = libros.map(libro => ({
        id: libro.id.value,
        titulo: libro.titulo.formatted(),
        autor: libro.autor.formatted(),
        isbn: libro.isbn.formatted(),
        informacionBasica: libro.informacionBasica()
      }));

      res.json({
        success: true,
        data: librosDTO,
        total: librosDTO.length
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * GET /api/libros/:id - Obtener un libro por ID
   */
  public obtenerLibroPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const libroId = LibroId.fromString(id);
      const libro = await this.libroRepository.buscarPorId(libroId);

      if (!libro) {
        res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
        return;
      }

      const libroDTO = {
        id: libro.id.value,
        titulo: libro.titulo.formatted(),
        autor: libro.autor.formatted(),
        isbn: libro.isbn.formatted(),
        estado: libro.estado,
        informacionBasica: libro.informacionBasica(),
        estaDisponible: libro.estaDisponible(),
        estaPrestado: libro.estaPrestado(),
        fechaIngreso: libro.fechaIngreso.toISOString(),
        fechaUltimaActualizacion: libro.fechaUltimaActualizacion.toISOString()
      };

      res.json({
        success: true,
        data: libroDTO
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * GET /api/libros/buscar/titulo/:titulo - Buscar libros por título
   */
  public buscarPorTitulo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { titulo } = req.params;
      
      if (!titulo || titulo.trim().length < 2) {
        res.status(400).json({
          success: false,
          message: 'El título de búsqueda debe tener al menos 2 caracteres'
        });
        return;
      }

      const libros = await this.libroRepository.buscarPorTitulo(titulo);
      
      const librosDTO = libros.map(libro => ({
        id: libro.id.value,
        titulo: libro.titulo.formatted(),
        autor: libro.autor.formatted(),
        isbn: libro.isbn.formatted(),
        estado: libro.estado,
        estaDisponible: libro.estaDisponible()
      }));

      res.json({
        success: true,
        data: librosDTO,
        total: librosDTO.length,
        busqueda: titulo
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * PUT /api/libros/:id/prestar - Prestar un libro
   */
  public prestarLibro = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const libroId = LibroId.fromString(id);
      const libro = await this.libroRepository.buscarPorId(libroId);

      if (!libro) {
        res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
        return;
      }

      // Ejecutar la operación de dominio
      libro.prestar();
      
      // Guardar los cambios
      await this.libroRepository.guardar(libro);

      res.json({
        success: true,
        message: `Libro "${libro.titulo.formatted()}" prestado exitosamente`,
        data: {
          id: libro.id.value,
          estado: libro.estado
        }
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  /**
   * PUT /api/libros/:id/devolver - Devolver un libro
   */
  public devolverLibro = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const libroId = LibroId.fromString(id);
      const libro = await this.libroRepository.buscarPorId(libroId);

      if (!libro) {
        res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
        return;
      }

      // Ejecutar la operación de dominio
      libro.devolver();
      
      // Guardar los cambios
      await this.libroRepository.guardar(libro);

      res.json({
        success: true,
        message: `Libro "${libro.titulo.formatted()}" devuelto exitosamente`,
        data: {
          id: libro.id.value,
          estado: libro.estado
        }
      });

    } catch (error) {
      this.manejarError(error, res);
    }
  };

  // ===== MANEJO DE ERRORES =====

  private manejarError(error: unknown, res: Response): void {
    console.error('Error en LibroController:', error);

    if (error instanceof DomainError) {
      // Errores de dominio -> 400 Bad Request
      res.status(400).json({
        success: false,
        message: error.message,
        type: 'domain_error'
      });
      return;
    }

    // Error genérico -> 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      type: 'internal_error'
    });
  }
} 