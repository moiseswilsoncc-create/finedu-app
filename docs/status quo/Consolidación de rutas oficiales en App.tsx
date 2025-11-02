# 🏗️ Milestone — Consolidación de rutas oficiales en App.tsx

## ✅ Archivos que permanecen en App.tsx
- 🧠 Flujo de ingreso:
  - Bienvenida
  - RegistroUsuario
  - LoginUsuario
  - PanelUsuario

- 🧩 Finanzas:
  - Finanza (pantalla central del usuario)
  - Ingresos
  - Egresos
  - ResumenFinanciero
  - SimuladorCreditos

- 🧩 Otros módulos de usuario:
  - VistaGrupal
  - AdminGrupo

- 🧩 Colaboradores:
  - RegistroColaborador
  - IngresoColaborador
  - LoginColaborador
  - PanelColaboradores
  - InvitacionColaboradores
  - OfertasColaborador
  - PublicarOfertaColaborador

- 🧩 Institucional:
  - DashboardInstitucional
  - EditorEstadoArchivos
  - EditorTrazabilidad
  - MetricaSupabase
  - TestInstitucional

- 🧩 Navegación:
  - MenuModulos
  - Navbar

---

## ❌ Archivos eliminados de App.tsx
- RegistroAhorro → absorbido en Egresos
- SimuladorInversion → duplicado, reemplazado por SimuladorCreditos
- TestFinanciero → absorbido en Resumen/Mi Salud Financiera
- EvaluadorCredito → reemplazado por SimuladorCreditos
- PanelOfertas → reemplazado por OfertasColaborador
- DatosOfertas → redundante, ya cubierto por Supabase + OfertasColaborador

---

## 📌 Estado actual
- `App.tsx` ahora contiene **solo los módulos oficiales**.  
- Se eliminó duplicidad y se reforzó la navegación institucional.  
- `Navbar` y `Finanza` se integran como parte central de la experiencia del usuario.  
- Colaboradores cuentan con dos rutas claras: **PublicarOfertaColaborador** (publicar) y **OfertasColaborador** (mostrar a usuarios).  

👉 Este milestone asegura que `App.tsx` sea la **fuente única de verdad** para la navegación de Finedu.
