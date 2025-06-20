# 📚 Tutorial: Biblioteca Digital DDD

## 🎯 Objetivo del Tutorial

Este proyecto te enseñará **Domain-Driven Design (DDD)** de manera práctica a través de un sistema real de biblioteca digital. Al finalizar, comprenderás:

- ✅ **Conceptos fundamentales de DDD**
- ✅ **Arquitectura en capas**
- ✅ **Patrones de diseño aplicados**
- ✅ **Cómo estructurar proyectos complejos**
- ✅ **Testing de dominio**

---

## 🚀 Cómo Empezar

### 1. Clonar e Instalar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El servidor estará en http://localhost:3000
```

### 2. Verificar que Funciona

```bash
# Probar la API
curl http://localhost:3000/api

# Debería responder con información del sistema
```

---

## 📖 Guía de Aprendizaje

### Paso 1: Entender el Dominio 🧠

**Empieza aquí:** `src/domain/`

El dominio es el **corazón de DDD**. Representa el conocimiento del negocio.

#### 🔍 Explora estos archivos en orden:

1. **`shared/domain/Entity.ts`** - Concepto base de entidad
2. **`shared/domain/ValueObject.ts`** - Concepto base de objeto de valor
3. **`libro/LibroId.ts`** - Identidad de libro
4. **`libro/ISBN.ts`** - Número internacional de libro
5. **`libro/Titulo.ts`** - Título del libro
6. **`libro/Autor.ts`** - Autor del libro
7. **`libro/EstadoLibro.ts`** - Estados posibles de un libro
8. **`libro/Libro.ts`** - La entidad principal ⭐

#### 💡 Conceptos Clave:

- **Entity**: Tiene identidad única (ej: Libro)
- **Value Object**: Se define por su valor (ej: ISBN)
- **Aggregate**: Grupo de entidades relacionadas
- **Domain Services**: Lógica que no pertenece a una entidad específica

---

### Paso 2: Casos de Uso 🎯

**Continúa aquí:** `src/application/`

La capa de aplicación orquesta las operaciones del sistema.

#### 🔍 Explora estos archivos:

1. **`libro/CrearLibroCommand.ts`** - Comando para crear libro
2. **`libro/CrearLibroUseCase.ts`** - Caso de uso completo

#### 💡 Conceptos Clave:

- **Commands**: Representan intenciones de cambio
- **Use Cases**: Orquestan operaciones de negocio
- **Application Services**: Coordinan entre dominio e infraestructura

---

### Paso 3: Infraestructura 🔧

**Después mira:** `src/infrastructure/`

Aquí están los detalles técnicos (bases de datos, APIs externas, etc.).

#### 🔍 Explora:

1. **`repositories/InMemoryLibroRepository.ts`** - Implementación de persistencia

#### 💡 Conceptos Clave:

- **Repository Pattern**: Abstrae la persistencia
- **Dependency Inversion**: El dominio no depende de infraestructura
- **Implementation**: Detalles técnicos específicos

---

### Paso 4: Presentación 🌐

**Finalmente:** `src/presentation/`

La capa que expone el sistema al mundo exterior.

#### 🔍 Explora:

1. **`controllers/LibroController.ts`** - Controlador REST
2. **`routes/libroRoutes.ts`** - Configuración de rutas

#### 💡 Conceptos Clave:

- **Controllers**: Manejan HTTP requests/responses
- **DTOs**: Objetos para transferir datos
- **Error Handling**: Manejo de errores por capas

---

## 🧪 Probando la API

### Crear un Libro

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Libro de Programación",
    "autor": "Tu Nombre",
    "isbn": "978-0132350884"
  }'
```

### Obtener Todos los Libros

```bash
curl http://localhost:3000/api/libros
```

### Buscar por Título

```bash
curl http://localhost:3000/api/libros/buscar/titulo/Clean
```

### Prestar un Libro

```bash
# Primero obtén el ID de un libro, luego:
curl -X PUT http://localhost:3000/api/libros/{ID_DEL_LIBRO}/prestar
```

### Devolver un Libro

```bash
curl -X PUT http://localhost:3000/api/libros/{ID_DEL_LIBRO}/devolver
```

---

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Agregar Validación
**Dificultad: Fácil**

Modifica la clase `Titulo` para que no permita títulos que contengan solo números.

### Ejercicio 2: Nuevo Value Object
**Dificultad: Medio**

Crea un Value Object `Editorial` con validaciones apropiadas.

### Ejercicio 3: Nuevo Caso de Uso
**Dificultad: Medio**

Implementa el caso de uso `BuscarLibrosPorAutorUseCase`.

### Ejercicio 4: Agregar Entidad
**Dificultad: Avanzado**

Crea la entidad `Usuario` con su repositorio y casos de uso completos.

### Ejercicio 5: Dominio Service
**Dificultad: Avanzado**

Implementa un `PrestamoService` que valide reglas complejas de préstamos.

---

## 🔍 Patrones Implementados

### 1. **Entity Pattern**
```typescript
// Tiene identidad única que persiste
class Libro extends Entity<LibroId> {
  // Los métodos modifican estado pero mantienen identidad
}
```

### 2. **Value Object Pattern**
```typescript
// Inmutable, definido por su valor
class ISBN extends ValueObject<string> {
  // Encapsula validaciones específicas del dominio
}
```

### 3. **Repository Pattern**
```typescript
// Interfaz en el dominio, implementación en infraestructura
interface LibroRepository {
  guardar(libro: Libro): Promise<void>;
}
```

### 4. **Command Pattern**
```typescript
// Encapsula una operación como objeto
class CrearLibroCommand {
  constructor(
    public readonly titulo: string,
    public readonly autor: string,
    public readonly isbn: string
  ) {}
}
```

### 5. **Use Case Pattern**
```typescript
// Orquesta operaciones de negocio
class CrearLibroUseCase {
  async ejecutar(command: CrearLibroCommand): Promise<string> {
    // Lógica de aplicación
  }
}
```

---

## 🏗️ Arquitectura del Proyecto

```
🏛️ ARQUITECTURA HEXAGONAL / CEBOLLA

┌─────────────────────────────────────────┐
│           📱 PRESENTATION               │
│    (Controllers, Routes, DTOs)          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         🎯 APPLICATION            │  │
│  │    (Use Cases, Commands)          │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │        🧠 DOMAIN            │  │  │
│  │  │   (Entities, Value Objects, │  │  │
│  │  │    Business Rules)          │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│           🔧 INFRASTRUCTURE             │
│   (Repositories, External Services)     │
└─────────────────────────────────────────┘
```

### Flujo de Dependencias

- **Presentation** → Application
- **Application** → Domain  
- **Infrastructure** → Domain (implementa interfaces)
- **Domain** → ❌ (no depende de nadie)

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm test -- --coverage
```

### Tipos de Tests

1. **Domain Tests**: Testan reglas de negocio
2. **Application Tests**: Testan casos de uso
3. **Integration Tests**: Testan capas juntas

---

## 📚 Recursos Adicionales

### Libros Recomendados
- 📖 **"Domain-Driven Design"** - Eric Evans
- 📖 **"Clean Code"** - Robert C. Martin
- 📖 **"Clean Architecture"** - Robert C. Martin

### Artículos
- 🔗 [DDD Reference](https://domainlanguage.com/ddd/reference/)
- 🔗 [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

## ❓ Preguntas Frecuentes

### ¿Por qué tantas clases para cosas simples?

**R:** En DDD preferimos **hacer explícito lo implícito**. Un `string` puede ser cualquier cosa, pero un `ISBN` solo puede ser un número de libro válido.

### ¿No es esto demasiado complejo para un CRUD simple?

**R:** DDD es para dominios **complejos**. Si solo necesitas un CRUD, usa herramientas más simples. DDD brilla cuando tienes lógica de negocio rica.

### ¿Debo usar DDD en todos mis proyectos?

**R:** No. DDD es útil cuando:
- ✅ El dominio es complejo
- ✅ Hay muchas reglas de negocio
- ✅ El proyecto crecerá en el tiempo
- ✅ Hay expertos del dominio disponibles

---

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí, ya tienes una base sólida en DDD. Ahora puedes:

1. **Expandir este proyecto** con más funcionalidades
2. **Aplicar DDD** en tus propios proyectos
3. **Enseñar DDD** a otros desarrolladores

¡La arquitectura limpia y el código expresivo te lo agradecerán! 🚀 