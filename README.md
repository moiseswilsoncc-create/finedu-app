# Finedu 💸

**Finedu** es una plataforma educativa y colaborativa para la autonomía financiera en LATAM. Diseñada para usuarios, colaboradores e instituciones, permite simular metas, visualizar impacto y fomentar decisiones informadas.

---

## 🚀 Características principales

- Simuladores de crédito, inversión y ahorro
- Visualización grupal e individual de metas
- Paneles de impacto y métricas colaborativas
- Foro financiero para aprendizaje comunitario
- Generación de PDF institucionales
- Redirección automática según tipo de usuario
- Rutas protegidas con control de sesión
- Modularización de componentes y estilos
- Preparado para despliegue en Vercel

---

## 🧩 Arquitectura del proyecto

- React + TypeScript
- React Router DOM para navegación
- Hooks personalizados para lógica de estado
- Modularización por componentes
- Estilos adaptables y escalables
- Despliegue automático desde GitHub a Vercel

---

## 📁 Estructura de carpetas

src/
├── App.tsx
├── index.tsx
├── types.ts
├── context/
│   └── FineduContext.tsx
├── components/
│   ├── AdminGrupo.tsx
│   ├── AsistenteFinanciero.tsx
│   ├── Bienvenida.tsx
│   ├── BotonCerrarSesion.tsx
│   ├── EditarPerfilUsuario.tsx
│   ├── FelicitacionRegistro.tsx
│   ├── ForoFinanciero.tsx
│   ├── GeneradorPDF.tsx
│   ├── GraficoAhorro.tsx
│   ├── IngresoColaborador.tsx
│   ├── IngresoUsuario.tsx
│   ├── Login.tsx
│   ├── MenuModulos.tsx
│   ├── MetricasColaboradores.tsx
│   ├── NuevaClave.tsx
│   ├── Navbar.tsx
│   ├── PanelColaboradores.tsx
│   ├── PanelImpacto.tsx
│   ├── PanelUsuario.tsx
│   ├── RecuperarClave.tsx
│   ├── RegistroAhorro.tsx
│   ├── RegistroColaborador.tsx
│   ├── RegistroUsuario.tsx
│   ├── Resumen.tsx
│   ├── RutaProtegida.tsx
│   ├── SelectorTipoUsuario.tsx
│   ├── SimuladorCredito.tsx
│   ├── SimuladorCreditoAuto.tsx
│   ├── SimuladorCreditoVivienda.tsx
│   ├── SimuladorInversion.tsx
│   ├── TestUsuario.tsx
│   ├── VistaEtapa.tsx
│   ├── VistaGrupal.tsx
│   ├── VistaIngresoColaborador.tsx
│   ├── VistaIngresoUsuario.tsx
│   ├── VistaInstitucional.tsx
│   ├── VistaMetaIndividual.tsx
│   ├── VistaParticipante.tsx
├── modules/
│   ├── DashboardInstitucional.tsx
│   ├── EvaluadorCreditoInteligente.tsx
│   └── InformeInstitucional.tsx

---

## 🛠 Instalación local

npm install  
npm run dev

---

## 🌐 Despliegue en Vercel

1. Subir este repositorio a GitHub  
2. Ir a vercel.com y conectar tu cuenta con GitHub  
3. Seleccionar el repositorio `finedu-app`  
4. Confirmar que el framework es React + Vite  
5. Deploy automático

---

## 👨‍💼 Autor

Wilson — Fundador de Finedu, Sentinela y Capital Raíz  
Visión: democratizar el acceso a herramientas financieras avanzadas en Chile y LATAM  
Enfoque: autonomía, colaboración, transparencia y educación financiera

---

## 📬 Contacto

Para alianzas institucionales, soporte técnico o contribuciones, contáctanos a través de tu correo institucional o canal de contacto.

<!-- Despliegue forzado para Vercel -->
