# 🔧 Ejemplos de Uso de la API

## 🚀 Inicio Rápido

### 1. Iniciar el Servidor

```bash
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 2. Verificar que Funciona

```bash
curl http://localhost:3000/health
```

---

## 📚 Ejemplos de Endpoints

### 🔍 Información del Sistema

```bash
# Ver información general de la API
curl http://localhost:3000/api

# Respuesta esperada:
{
  "success": true,
  "message": "API de Biblioteca Digital - Tutorial DDD",
  "version": "1.0.0",
  "endpoints": {
    "libros": "/api/libros",
    "salud": "/health"
  },
  "conceptos_ddd": [
    "Domain-Driven Design",
    "Entities y Value Objects",
    "Aggregates y Repositories",
    "Use Cases y Commands",
    "Arquitectura Hexagonal"
  ]
}
```

---

## 📖 Gestión de Libros

### ✅ Crear un Libro

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Clean Architecture: A Craftsman Guide to Software Structure and Design",
    "autor": "Robert C. Martin",
    "isbn": "978-0134494166"
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro creado exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### 📋 Obtener Todos los Libros

```bash
curl http://localhost:3000/api/libros
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123...",
      "titulo": "Clean Code: A Handbook of Agile Software Craftsmanship",
      "autor": "Robert C. Martin",
      "isbn": "978-0-13-235088-4",
      "estado": "disponible",
      "informacionBasica": "\"Clean Code: A Handbook of Agile Software Craftsmanship\" por Robert C. Martin (978-0-13-235088-4)",
      "estaDisponible": true,
      "fechaIngreso": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 5
}
```

### 🔎 Buscar Libros por Título

```bash
# Buscar libros que contengan "Clean" en el título
curl http://localhost:3000/api/libros/buscar/titulo/Clean
```

### 📚 Obtener Solo Libros Disponibles

```bash
curl http://localhost:3000/api/libros/disponibles
```

### 🔍 Obtener un Libro Específico

```bash
# Reemplaza {ID} con un ID real de libro
curl http://localhost:3000/api/libros/{ID}
```

---

## 🔄 Operaciones de Préstamo

### 📤 Prestar un Libro

```bash
# Reemplaza {ID} con un ID real de libro disponible
curl -X PUT http://localhost:3000/api/libros/{ID}/prestar
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro \"Clean Code: A Handbook of Agile Software Craftsmanship\" prestado exitosamente",
  "data": {
    "id": "abc123...",
    "estado": "prestado"
  }
}
```

### 📥 Devolver un Libro

```bash
# Reemplaza {ID} con un ID real de libro prestado
curl -X PUT http://localhost:3000/api/libros/{ID}/devolver
```

---

## 🧪 Flujo Completo de Prueba

### Script de Prueba Completa

```bash
#!/bin/bash

echo "🚀 Iniciando prueba completa de la API..."

# 1. Verificar que el servidor está funcionando
echo "1. Verificando servidor..."
curl -s http://localhost:3000/health | jq .

# 2. Ver información de la API
echo -e "\n2. Información de la API..."
curl -s http://localhost:3000/api | jq .

# 3. Ver libros iniciales
echo -e "\n3. Libros iniciales..."
curl -s http://localhost:3000/api/libros | jq .

# 4. Crear un nuevo libro
echo -e "\n4. Creando nuevo libro..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Libro de Prueba",
    "autor": "Autor de Prueba",
    "isbn": "978-0132350884"
  }')

echo $RESPONSE | jq .

# Extraer el ID del libro creado
LIBRO_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "ID del libro creado: $LIBRO_ID"

# 5. Ver el libro específico
echo -e "\n5. Viendo libro específico..."
curl -s http://localhost:3000/api/libros/$LIBRO_ID | jq .

# 6. Prestar el libro
echo -e "\n6. Prestando libro..."
curl -s -X PUT http://localhost:3000/api/libros/$LIBRO_ID/prestar | jq .

# 7. Intentar prestar de nuevo (debería fallar)
echo -e "\n7. Intentando prestar de nuevo (debería fallar)..."
curl -s -X PUT http://localhost:3000/api/libros/$LIBRO_ID/prestar | jq .

# 8. Devolver el libro
echo -e "\n8. Devolviendo libro..."
curl -s -X PUT http://localhost:3000/api/libros/$LIBRO_ID/devolver | jq .

# 9. Buscar por título
echo -e "\n9. Buscando por título 'Prueba'..."
curl -s http://localhost:3000/api/libros/buscar/titulo/Prueba | jq .

echo -e "\n✅ Prueba completa finalizada!"
```

### Cómo Ejecutar el Script

1. Guarda el script como `test_api.sh`
2. Dale permisos de ejecución: `chmod +x test_api.sh`
3. Ejecuta: `./test_api.sh`

---

## ❌ Ejemplos de Errores

### ISBN Duplicado

```bash
# Intentar crear un libro con ISBN que ya existe
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Otro Libro",
    "autor": "Otro Autor",
    "isbn": "978-0132350884"
  }'
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "Regla de negocio violada: Ya existe un libro con el ISBN 978-0-13-235088-4",
  "type": "domain_error"
}
```

### ISBN Inválido

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Libro con ISBN malo",
    "autor": "Autor",
    "isbn": "isbn-invalido"
  }'
```

### Datos Faltantes

```bash
curl -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "",
    "autor": "Autor",
    "isbn": "978-0132350884"
  }'
```

### Libro No Encontrado

```bash
# Intentar obtener un libro con ID inexistente
curl http://localhost:3000/api/libros/00000000-0000-0000-0000-000000000000
```

---

## 🔍 Validaciones de Dominio

### ISBN Válidos que Puedes Usar

```bash
# ISBN-10 válidos
"0132350882"
"013235088X"

# ISBN-13 válidos  
"978-0132350884"
"978-0321125217"
"978-0201633610"
"978-0135957059"
"978-0134757599"
```

### Títulos de Prueba

```bash
"Clean Code"
"Domain-Driven Design"
"The Pragmatic Programmer"
"Design Patterns"
"Refactoring"
```

---

## 📊 Testing con Postman

### Colección de Postman

Puedes crear una colección de Postman con estos endpoints:

1. **GET** `{{baseUrl}}/health` - Verificar salud
2. **GET** `{{baseUrl}}/api` - Info de la API
3. **GET** `{{baseUrl}}/api/libros` - Listar libros
4. **POST** `{{baseUrl}}/api/libros` - Crear libro
5. **GET** `{{baseUrl}}/api/libros/{{libroId}}` - Obtener libro
6. **PUT** `{{baseUrl}}/api/libros/{{libroId}}/prestar` - Prestar
7. **PUT** `{{baseUrl}}/api/libros/{{libroId}}/devolver` - Devolver

**Variables de entorno:**
- `baseUrl`: `http://localhost:3000`
- `libroId`: (ID de un libro existente)

---

## 💡 Consejos para Pruebas

### 1. Usar `jq` para Formatear JSON

```bash
curl http://localhost:3000/api/libros | jq .
```

### 2. Guardar IDs para Reutilizar

```bash
# Extraer ID del response
LIBRO_ID=$(curl -s -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","autor":"Test","isbn":"978-0132350884"}' \
  | jq -r '.data.id')

# Usar el ID
curl http://localhost:3000/api/libros/$LIBRO_ID
```

### 3. Ver Headers HTTP

```bash
curl -i http://localhost:3000/api/libros
```

### 4. Medir Tiempo de Respuesta

```bash
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/libros
```

**Archivo `curl-format.txt`:**
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

---

¡Ahora tienes todo lo necesario para probar y entender la API de la Biblioteca Digital! 🎉 