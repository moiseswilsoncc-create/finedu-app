# Finedu · Plataforma de Educación Financiera Colaborativa

**Finedu** es una plataforma modular e inclusiva que empodera a personas y familias en Latinoamérica para tomar decisiones financieras informadas. A través de simuladores, visualizaciones y herramientas educativas, Finedu promueve el ahorro, la planificación y el acceso responsable al crédito.

---

## 🎯 Propósito

- Democratizar el acceso a herramientas de análisis financiero  
- Fomentar la educación financiera desde una perspectiva práctica y colaborativa  
- Conectar a usuarios con instituciones que ofrecen productos responsables y transparentes  

---

## 🧩 Estructura modular

| Módulo                        | Propósito principal                                                                 |
|------------------------------|--------------------------------------------------------------------------------------|
| `VistaParticipante`          | Formulario para agregar participantes con ingresos y egresos                        |
| `VistaGrupal`                | Visualiza el progreso colectivo hacia una meta común                                |
| `VistaMetaIndividual`        | Muestra el cumplimiento de metas individuales                                       |
| `VistaEtapa`                 | Proyección mensual, trimestral y anual del ahorro acumulado                         |
| `Resumen`                    | Ahorro total, promedio y cumplimiento grupal                                        |
| `SimuladorCredito`           | Compara crédito de consumo vs. crédito comercial                                    |
| `SimuladorCreditoAuto`       | Evalúa sobrecosto en crédito automotriz                                             |
| `SimuladorCreditoVivienda`   | Calcula impacto financiero de crédito hipotecario                                   |
| `SimuladorInversion`         | Proyecta rentabilidad según tipo de inversión y plazo                               |
| `GraficoAhorro`              | Visualiza el ahorro individual y grupal con gráficos dinámicos                      |
| `IngresoUsuario`             | Registro de usuarios con datos personales y demográficos                            |
| `IngresoColaborador`         | Registro de instituciones colaboradoras con datos institucionales                  |
| `PanelColaboradores`         | Panel exclusivo para que instituciones publiquen ofertas financieras preferentes   |
| `PanelImpacto`               | Visualiza el impacto colectivo y segmentado por país o institución                  |
| `MetricasColaboradores`      | Muestra métricas agregadas por institución                                          |
| `GeneradorPDF`               | Exporta resultados y métricas en formato institucional                              |
| `ForoFinanciero`             | Espacio de diálogo y aprendizaje entre usuarios y colaboradores                     |

---

## 🔐 Flujo de autenticación

Finedu incluye un sistema de autenticación conectado al backend Express:

- `Login.tsx`: Validación real contra base de datos (`usuarios.json`). Guarda sesión en `localStorage` y redirige a `/usuario`.
- `RecuperarClave.tsx`: Verifica si el correo existe y simula envío de token.
- `NuevaClave.tsx`: Recibe `token` y `correo` desde la URL. Actualiza la contraseña en el backend.
- `RutaProtegida`: Bloquea acceso a `/usuario` si no hay sesión activa.
- Botón de cierre de sesión: Limpia `localStorage` y redirige al login.

---

## 🧭 Acceso segmentado

Finedu distingue entre tres tipos de acceso:

- **Usuarios**: acceden a simuladores, visualizaciones y herramientas educativas  
- **Colaboradores**: acceden a métricas, paneles y generación de informes  
- **Institucionales**: visualizan resultados agregados por país y grupo  

Esta separación garantiza una experiencia personalizada y segura para cada perfil.

---

## ⚙️ Variables de entorno

El archivo `.env` permite configurar la URL del backend:

```env
REACT_APP_API_URL=http://localhost:4000/api
├── finedu-app/         # Frontend en React
│   ├── components/     # Módulos visuales y funcionales
│   ├── App.tsx         # Rutas y flujo principal con protección
│   ├── axiosConfig.ts  # Conexión centralizada al backend
│   └── .env            # Variable de entorno para conexión con backend
├── backend/            # Servidor Express
│   ├── server.js       # Configuración principal del servidor
│   ├── routes/         # Rutas de autenticación
│   ├── data/           # Usuarios simulados en JSON
│   └── package.json    # Dependencias y script de inicio
🛠️ Tecnologías utilizadas
React + TypeScript

Express + JSON como base de datos simulada

Chart.js para visualizaciones

Arquitectura modular y escalable

Rutas protegidas con localStorage

Preparado para integración con Firebase, Supabase o bases reales

🤝 Invitación a colaborar
Finedu está abierto a alianzas con:

Bancos y cooperativas responsables

Instituciones educativas

Organismos públicos y ONGs

Desarrolladores y diseñadores con propósito social

📬 Contacto
Para colaborar, escribir a: contacto@finedu.org Sitio web (en desarrollo): www.finedu.org

“La educación financiera no es un privilegio, es una herramienta de libertad.”
