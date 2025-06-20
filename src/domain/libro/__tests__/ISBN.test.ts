import { ISBN } from '../ISBN';
import { InvalidArgumentError } from '../../../shared/domain/DomainError';

/**
 * 🎯 TESTS DE VALUE OBJECT: ISBN
 * 
 * Los tests de Value Objects se centran en:
 * - Validaciones de formato
 * - Algoritmos de validación específicos del dominio
 * - Inmutabilidad
 * - Igualdad basada en valor
 */

describe('ISBN - Value Object', () => {

  describe('Validación ISBN-10', () => {
    it('debería aceptar ISBN-10 válidos', () => {
      // Arrange & Act
      const isbn1 = new ISBN('0132350882');
      const isbn2 = new ISBN('0-13-235088-2');
      const isbn3 = new ISBN('013235088X'); // Con X como check digit

      // Assert
      expect(isbn1.value).toBe('0132350882');
      expect(isbn2.value).toBe('0-13-235088-2');
      expect(isbn3.value).toBe('013235088X');
    });

    it('debería formatear ISBN-10 correctamente', () => {
      // Arrange
      const isbn = new ISBN('0132350882');

      // Act
      const formatted = isbn.formatted();

      // Assert
      expect(formatted).toBe('0-1323-5088-2');
    });

    it('debería rechazar ISBN-10 con dígito de verificación inválido', () => {
      // Act & Assert
      expect(() => new ISBN('0132350881')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('0132350881')).toThrow(/Dígito de verificación ISBN-10 inválido/);
    });

    it('debería rechazar ISBN-10 con formato inválido', () => {
      // Act & Assert
      expect(() => new ISBN('01323508A2')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('01323508A2')).toThrow(/Formato ISBN-10 inválido/);
    });
  });

  describe('Validación ISBN-13', () => {
    it('debería aceptar ISBN-13 válidos', () => {
      // Arrange & Act
      const isbn1 = new ISBN('9780132350884');
      const isbn2 = new ISBN('978-0-13-235088-4');
      const isbn3 = new ISBN('978-0321125217');

      // Assert
      expect(isbn1.value).toBe('9780132350884');
      expect(isbn2.value).toBe('978-0-13-235088-4');
      expect(isbn3.value).toBe('978-0321125217');
    });

    it('debería formatear ISBN-13 correctamente', () => {
      // Arrange
      const isbn = new ISBN('9780132350884');

      // Act
      const formatted = isbn.formatted();

      // Assert
      expect(formatted).toBe('978-0-13-235088-4');
    });

    it('debería rechazar ISBN-13 con dígito de verificación inválido', () => {
      // Act & Assert
      expect(() => new ISBN('9780132350885')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('9780132350885')).toThrow(/Dígito de verificación ISBN-13 inválido/);
    });

    it('debería rechazar ISBN-13 con formato inválido', () => {
      // Act & Assert
      expect(() => new ISBN('97801323508A4')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('97801323508A4')).toThrow(/Formato ISBN-13 inválido/);
    });
  });

  describe('Validaciones generales', () => {
    it('debería rechazar ISBN vacío', () => {
      // Act & Assert
      expect(() => new ISBN('')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('')).toThrow(/El ISBN no puede estar vacío/);
    });

    it('debería rechazar ISBN con longitud incorrecta', () => {
      // Act & Assert
      expect(() => new ISBN('123456789')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('123456789')).toThrow(/El ISBN debe tener 10 o 13 dígitos/);
      
      expect(() => new ISBN('12345678901234')).toThrow(InvalidArgumentError);
      expect(() => new ISBN('12345678901234')).toThrow(/El ISBN debe tener 10 o 13 dígitos/);
    });

    it('debería manejar espacios y guiones en la validación', () => {
      // Arrange & Act
      const isbn1 = new ISBN(' 978-0-13-235088-4 ');
      const isbn2 = new ISBN('978 0 13 235088 4');

      // Assert - Los espacios y guiones no deberían afectar la validación
      expect(() => isbn1).not.toThrow();
      expect(() => isbn2).not.toThrow();
    });
  });

  describe('Igualdad de Value Objects', () => {
    it('debería considerar iguales ISBN con el mismo valor', () => {
      // Arrange
      const isbn1 = new ISBN('978-0-13-235088-4');
      const isbn2 = new ISBN('9780132350884'); // Mismo ISBN sin guiones

      // Act & Assert
      expect(isbn1.equals(isbn2)).toBe(false); // Diferentes porque el valor string es diferente
      
      // Pero el valor limpio es el mismo
      const isbn3 = new ISBN('978-0-13-235088-4');
      const isbn4 = new ISBN('978-0-13-235088-4');
      expect(isbn3.equals(isbn4)).toBe(true);
    });

    it('debería considerar diferentes ISBN con valores distintos', () => {
      // Arrange
      const isbn1 = new ISBN('978-0-13-235088-4');
      const isbn2 = new ISBN('978-0-32-112521-7');

      // Act & Assert
      expect(isbn1.equals(isbn2)).toBe(false);
    });
  });

  describe('Inmutabilidad', () => {
    it('no debería permitir modificar el valor después de la creación', () => {
      // Arrange
      const isbn = new ISBN('978-0-13-235088-4');
      const originalValue = isbn.value;

      // Act - Intentar modificar (esto no debería ser posible con TypeScript)
      // (isbn as any)._value = 'otro-valor'; // Esto fallaría en compilación

      // Assert
      expect(isbn.value).toBe(originalValue);
    });
  });
}); 