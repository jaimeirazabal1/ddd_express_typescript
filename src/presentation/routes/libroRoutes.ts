import { Router } from 'express';
import { LibroController } from '../controllers/LibroController';
import { CrearLibroUseCase } from '../../application/libro/CrearLibroUseCase';
import { InMemoryLibroRepository } from '../../infrastructure/repositories/InMemoryLibroRepository';

/**
 * 🎯 RUTAS: Libro Routes
 * 
 * Define todas las rutas HTTP relacionadas con libros.
 * En un proyecto más grande, esto estaría en un archivo de configuración
 * de dependencias (dependency injection container).
 */

export function crearLibroRoutes(): Router {
  const router = Router();

  // Configurar dependencias
  const libroRepository = new InMemoryLibroRepository();
  const crearLibroUseCase = new CrearLibroUseCase(libroRepository);
  const libroController = new LibroController(crearLibroUseCase, libroRepository);

  // ===== RUTAS DE LIBROS =====

  // Crear libro
  router.post('/', libroController.crearLibro);

  // Obtener todos los libros
  router.get('/', libroController.obtenerLibros);

  // Obtener libros disponibles
  router.get('/disponibles', libroController.obtenerLibrosDisponibles);

  // Buscar por título
  router.get('/buscar/titulo/:titulo', libroController.buscarPorTitulo);

  // Obtener libro por ID
  router.get('/:id', libroController.obtenerLibroPorId);

  // Operaciones de préstamo
  router.put('/:id/prestar', libroController.prestarLibro);
  router.put('/:id/devolver', libroController.devolverLibro);

  return router;
} 