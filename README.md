# 📚 Sistema de Biblioteca Digital - Tutorial DDD

## ¿Qué es Domain-Driven Design (DDD)?

**Domain-Driven Design** es un enfoque de desarrollo de software que se centra en:
- **Entender profundamente el negocio** (el dominio)
- **Crear un modelo rico** que refleje la realidad del negocio
- **Usar un lenguaje ubicuo** entre desarrolladores y expertos del dominio
- **Organizar el código** de manera que refleje el modelo de negocio

## 🎯 ¿Por qué una Biblioteca Digital?

Elegimos este dominio porque:
- ✅ **Es familiar** - todos entendemos qué es una biblioteca
- ✅ **Tiene reglas de negocio claras** - préstamos, devoluciones, usuarios
- ✅ **Es lo suficientemente complejo** - para mostrar conceptos DDD
- ✅ **Es lo suficientemente simple** - para no perderse en detalles

## 🏗️ Arquitectura del Proyecto

```
src/
├── domain/              # 🧠 CORAZÓN DEL NEGOCIO
│   ├── libro/          # Agregado Libro
│   ├── usuario/        # Agregado Usuario  
│   ├── prestamo/       # Agregado Préstamo
│   └── shared/         # Objetos compartidos
├── application/        # 🎯 CASOS DE USO
│   ├── libro/         # Comandos y consultas de libros
│   ├── usuario/       # Comandos y consultas de usuarios
│   └── prestamo/      # Comandos y consultas de préstamos
├── infrastructure/    # 🔧 DETALLES TÉCNICOS
│   ├── repositories/ # Persistencia de datos
│   ├── services/     # Servicios externos
│   └── database/     # Configuración BD
└── presentation/     # 🌐 API REST
    ├── controllers/  # Controladores HTTP
    ├── dtos/        # Objetos de transferencia
    └── middleware/  # Middlewares
```

## 🧱 Conceptos DDD que Aprenderás

### 1. **Entities** (Entidades)
Objetos con identidad única que persisten en el tiempo.
```typescript
// Ejemplo: Un libro tiene un ID único
class Libro {
  private readonly id: LibroId;
  private titulo: string;
  // ...
}
```

### 2. **Value Objects** (Objetos de Valor)
Objetos inmutables definidos por sus atributos.
```typescript
// Ejemplo: ISBN no tiene identidad, solo valor
class ISBN {
  constructor(private readonly valor: string) {
    this.validar();
  }
}
```

### 3. **Aggregates** (Agregados)
Grupos de entidades que se modifican juntas.
```typescript
// Ejemplo: Préstamo agrupa Libro + Usuario + Fechas
class Prestamo {
  // Garantiza consistencia de negocio
}
```

### 4. **Domain Services** (Servicios de Dominio)
Lógica de negocio que no pertenece a una entidad específica.

### 5. **Repositories** (Repositorios)
Abstracción para persistir y recuperar agregados.

### 6. **Use Cases** (Casos de Uso)
Operaciones específicas que puede realizar el sistema.

## 🚀 Comenzando

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 3. Ejecutar tests
```bash
npm test
```

## 📖 Flujo de Aprendizaje Recomendado

1. **Empieza por el Domain** - Entiende las entidades y reglas de negocio
2. **Luego Application** - Ve cómo se orquestan los casos de uso
3. **Después Infrastructure** - Observa los detalles técnicos
4. **Finalmente Presentation** - Ve cómo se expone la API

## 🎓 Para Instructores

Este proyecto está diseñado para:
- **Explicar conceptos paso a paso**
- **Mostrar código real y funcional**
- **Demostrar buenas prácticas**
- **Ser base para ejercicios prácticos**

## 📚 Endpoints de la API

- `POST /api/usuarios` - Registrar usuario
- `POST /api/libros` - Agregar libro
- `POST /api/prestamos` - Crear préstamo
- `GET /api/libros` - Listar libros disponibles
- `PUT /api/prestamos/:id/devolver` - Devolver libro

---

> **💡 Tip**: Lee el código en el orden de las capas: Domain → Application → Infrastructure → Presentation 