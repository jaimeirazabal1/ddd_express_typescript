import { Libro } from '../Libro';
import { ISBN } from '../ISBN';
import { Titulo } from '../Titulo';
import { Autor } from '../Autor';
import { EstadoLibro } from '../EstadoLibro';
import { BusinessRuleError } from '../../../shared/domain/DomainError';

/**
 * 🎯 TESTS DE DOMINIO: Libro
 * 
 * Los tests de dominio se centran en probar:
 * - Reglas de negocio
 * - Invariantes del dominio
 * - Comportamientos de las entidades
 * - Validaciones de Value Objects
 */

describe('Libro - Entity', () => {

  describe('Creación de libro', () => {
    it('debería crear un libro con datos válidos', () => {
      // Arrange & Act
      const libro = Libro.crear(
        'Clean Code',
        'Robert C. Martin',
        '978-0132350884'
      );

      // Assert
      expect(libro.titulo.value).toBe('Clean Code');
      expect(libro.autor.value).toBe('Robert C. Martin');
      expect(libro.isbn.value).toBe('978-0132350884');
      expect(libro.estado).toBe(EstadoLibro.DISPONIBLE);
      expect(libro.estaDisponible()).toBe(true);
    });

    it('debería tener un ID único al crear', () => {
      // Arrange & Act
      const libro1 = Libro.crear('Libro 1', 'Autor 1', '978-0132350884');
      const libro2 = Libro.crear('Libro 2', 'Autor 2', '978-0321125217');

      // Assert
      expect(libro1.id.value).not.toBe(libro2.id.value);
      expect(libro1.id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Operaciones de préstamo', () => {
    let libro: Libro;

    beforeEach(() => {
      libro = Libro.crear(
        'Domain-Driven Design',
        'Eric Evans',
        '978-0321125217'
      );
    });

    it('debería permitir prestar un libro disponible', () => {
      // Act
      libro.prestar();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.PRESTADO);
      expect(libro.estaPrestado()).toBe(true);
      expect(libro.estaDisponible()).toBe(false);
    });

    it('debería permitir devolver un libro prestado', () => {
      // Arrange
      libro.prestar();

      // Act
      libro.devolver();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.DISPONIBLE);
      expect(libro.estaDisponible()).toBe(true);
      expect(libro.estaPrestado()).toBe(false);
    });

    it('no debería permitir prestar un libro ya prestado', () => {
      // Arrange
      libro.prestar();

      // Act & Assert
      expect(() => libro.prestar()).toThrow(BusinessRuleError);
      expect(() => libro.prestar()).toThrow(/No se puede prestar el libro/);
    });

    it('no debería permitir devolver un libro que no está prestado', () => {
      // Act & Assert
      expect(() => libro.devolver()).toThrow(BusinessRuleError);
      expect(() => libro.devolver()).toThrow(/No se puede devolver el libro/);
    });
  });

  describe('Operaciones de reserva', () => {
    let libro: Libro;

    beforeEach(() => {
      libro = Libro.crear(
        'The Pragmatic Programmer',
        'Andrew Hunt',
        '978-0135957059'
      );
    });

    it('debería permitir reservar un libro disponible', () => {
      // Act
      libro.reservar();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.RESERVADO);
    });

    it('debería permitir prestar un libro reservado', () => {
      // Arrange
      libro.reservar();

      // Act
      libro.prestar();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.PRESTADO);
    });

    it('debería permitir cancelar una reserva', () => {
      // Arrange
      libro.reservar();

      // Act
      libro.cancelarReserva();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.DISPONIBLE);
    });

    it('no debería permitir reservar un libro prestado', () => {
      // Arrange
      libro.prestar();

      // Act & Assert
      expect(() => libro.reservar()).toThrow(BusinessRuleError);
    });
  });

  describe('Operaciones de mantenimiento', () => {
    let libro: Libro;

    beforeEach(() => {
      libro = Libro.crear(
        'Design Patterns',
        'Gang of Four',
        '978-0201633610'
      );
    });

    it('debería permitir poner un libro disponible en mantenimiento', () => {
      // Act
      libro.ponerEnMantenimiento();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.EN_MANTENIMIENTO);
    });

    it('no debería permitir poner en mantenimiento un libro prestado', () => {
      // Arrange
      libro.prestar();

      // Act & Assert
      expect(() => libro.ponerEnMantenimiento()).toThrow(BusinessRuleError);
    });

    it('debería permitir dar de baja un libro disponible', () => {
      // Act
      libro.darDeBaja();

      // Assert
      expect(libro.estado).toBe(EstadoLibro.DADO_DE_BAJA);
    });

    it('no debería permitir dar de baja un libro prestado', () => {
      // Arrange
      libro.prestar();

      // Act & Assert
      expect(() => libro.darDeBaja()).toThrow(BusinessRuleError);
    });
  });

  describe('Métodos de consulta', () => {
    it('debería proporcionar información básica formateada', () => {
      // Arrange
      const libro = Libro.crear(
        'clean code',
        'robert c. martin',
        '978-0132350884'
      );

      // Act
      const info = libro.informacionBasica();

      // Assert
      expect(info).toBe('"Clean Code" por Robert C. Martin (978-0-13-235088-4)');
    });
  });

  describe('Reconstitución desde persistencia', () => {
    it('debería reconstituir un libro desde datos persistidos', () => {
      // Arrange
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const fechaIngreso = new Date('2023-01-01');
      const fechaActualizacion = new Date('2023-01-02');

      // Act
      const libro = Libro.reconstituir(
        id,
        'Clean Code',
        'Robert C. Martin',
        '978-0132350884',
        EstadoLibro.PRESTADO,
        fechaIngreso,
        fechaActualizacion
      );

      // Assert
      expect(libro.id.value).toBe(id);
      expect(libro.estado).toBe(EstadoLibro.PRESTADO);
      expect(libro.fechaIngreso).toEqual(fechaIngreso);
      expect(libro.fechaUltimaActualizacion).toEqual(fechaActualizacion);
    });
  });
}); 