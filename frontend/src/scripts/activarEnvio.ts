// Script institucional para activar el envío automatizado del informe mensual
import { enviarInformeMensual } from "../utils/enviarInforme";

// 🔒 Este script debe ejecutarse manualmente o programarse vía cronjob controlado
// 📤 Envía el informe institucional a los colaboradores registrados
// 🕒 Asegúrate de que los datos estén actualizados antes de ejecutar

enviarInformeMensual()
  .then(() => {
    console.log("✅ Informe mensual enviado correctamente.");
  })
  .catch((error) => {
    console.error("❌ Error al enviar el informe mensual:", error);
  });
