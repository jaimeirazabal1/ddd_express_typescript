import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { crearLibroRoutes } from './presentation/routes/libroRoutes';

/**
 * 🎯 PUNTO DE ENTRADA: Main Application
 * 
 * Aquí configuramos y iniciamos nuestra aplicación Express.
 * Esta es la capa más externa que coordina todo el sistema.
 */

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE DE SEGURIDAD =====

// Helmet para headers de seguridad
app.use(helmet());

// CORS para permitir requests desde otros dominios
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use('/api/', limiter);

// ===== MIDDLEWARE DE PARSING =====

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS =====

// Ruta de salud del sistema
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Biblioteca Digital funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de información del API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API de Biblioteca Digital - Tutorial DDD',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      libros: '/api/libros',
      salud: '/health'
    },
    conceptos_ddd: [
      'Domain-Driven Design',
      'Entities y Value Objects',
      'Aggregates y Repositories',
      'Use Cases y Commands',
      'Arquitectura Hexagonal'
    ]
  });
});

// Rutas de dominio
app.use('/api/libros', crearLibroRoutes());

// ===== MANEJO DE ERRORES GLOBAL =====

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    suggestion: 'Visita /api para ver los endpoints disponibles'
  });
});

// Middleware de manejo de errores
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no capturado:', error);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
});

// ===== INICIO DEL SERVIDOR =====

app.listen(PORT, () => {
  console.log('\n🚀 ===============================================');
  console.log('📚 SISTEMA DE BIBLIOTECA DIGITAL - TUTORIAL DDD');
  console.log('===============================================');
  console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📋 API disponible en: http://localhost:${PORT}/api`);
  console.log(`❤️  Salud del sistema: http://localhost:${PORT}/health`);
  console.log('===============================================');
  console.log('\n🎓 CONCEPTOS DDD IMPLEMENTADOS:');
  console.log('   ✅ Entities (Libro, Usuario)');
  console.log('   ✅ Value Objects (ISBN, Email, Titulo)');
  console.log('   ✅ Repositories (LibroRepository)');
  console.log('   ✅ Use Cases (CrearLibroUseCase)');
  console.log('   ✅ Domain Services');
  console.log('   ✅ Arquitectura en Capas');
  console.log('===============================================\n');
});

// Manejo graceful de shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
}); 