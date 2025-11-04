# 📊 Estado de Construcción Finedu — Autenticación y Configuración

Este documento institucionaliza los avances y correcciones realizadas en la jornada de ayer, abarcando **autenticación**, **recuperación de credenciales**, **configuración de Supabase**, y **despliegue en Vercel**. Se detallan los archivos modificados, las políticas aplicadas y los pendientes de integración.

---

## 1. Archivos modificados

### Frontend
- **src/colaboradores/ActivarColaborador.tsx**  
  Actualización de nomenclatura `clave` en flujos de activación.

- **src/components/EditarPerfilUsuario.tsx**  
  Ajuste de campo de autenticación a `clave`.

- **src/components/NuevaClave.tsx**  
  Refactor de recuperación de credenciales.  
  - Uso de `clave` en estado y validación.  
  - Validación de longitud según política institucional.  
  - Actualización de consultas a Supabase.

- **src/components/RecuperarClave.tsx**  
  Actualización de lógica de recuperación con `clave`.

- **src/components/RegistroUsuario.tsx**  
  Unificación de nomenclatura en registro inicial.

- **src/types.ts**  
  Actualización de tipado para reflejar `clave` en lugar de `contraseña`.

---

## 2. Configuraciones institucionalizadas

- **Política de claves**  
  - Usuarios: mínimo 6 caracteres.  
  - Colaboradores: mínimo 8 caracteres.  

- **Unificación de nomenclatura**  
  Reemplazo global de `contraseña` → `clave` en todo el código base.

- **Supabase**  
  - Validación directa en recuperación de clave (sin listas hardcodeadas).  
  - Restauración de `DEFAULT UUID` en `usuarios_activos.id`.

- **Backend**  
  - `index.js` validado como raíz oficial con rutas ESModules, middleware y validación de entorno.

- **Frontend**  
  - Consolidación de `App.tsx` como archivo oficial de rutas de autenticación, recuperación y onboarding.  
  - Corrección de `VistaErrorAcceso` para redirigir según origen del flujo.  
  - Migración a Vite con ESM documentada como milestone técnico.

---

## 3. Estado de despliegue

- **Vercel**  
  Aplicación funcionando con el último commit válido en `main`.  
  Los cambios de nomenclatura aún no están en producción debido a conflictos de rebase.

- **Supabase**  
  Tablas y validaciones operativas con nomenclatura `clave`.

- **Local**  
  Cambios listos pero con conflictos pendientes en:  
  - `src/components/NuevaClave.tsx`  
  - `src/components/RecuperarClave.tsx`  
  - `src/components/RegistroUsuario.tsx`

---

## 📌 Próximos pasos

1. Resolver conflictos de rebase en los tres archivos pendientes.  
2. Confirmar commit y push a `main`.  
3. Validar redeploy automático en Vercel.  
4. Documentar cierre de este milestone en `estadoConstruccionFinedu.md`.

---
