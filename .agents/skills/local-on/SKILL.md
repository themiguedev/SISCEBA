---
name: local-on
description: Inicia el entorno completo de desarrollo de SIS-CBA levantando tanto los servicios de Base de Datos Local / Gateway (npm run db:start) como el servidor de frontend Vite (npm run dev).
---

# Skill: Local ON

Esta skill automatiza el arranque completo e integral de los servicios necesarios para ejecutar y probar la aplicacion SICE-CBA localmente.

## Componentes del Entorno
1. **Base de Datos Local & Gateway Supabase**:
   - Comando: npm run db:start
   - Endpoints: PostgreSQL en localhost:5432 y Gateway REST en http://127.0.0.1:54321/rest/v1/

2. **Servidor Web Frontend**:
   - Comando: npm run dev
   - Interfaz en tiempo real con Vite (HMR)

## Flujo de Ejecucion
1. Iniciar el servicio de base de datos local (npm run db:start).
2. Iniciar el servidor de desarrollo Vite (npm run dev).
3. Confirmar que ambos servicios esten operativos y listos para interactuar.
