import cron from "node-cron";
import axios from "axios";

// Ejecutar todos los días a las 00:10 AM
cron.schedule("10 0 * * *", async () => {
  try {
    const response = await axios.delete("https://TU_DOMINIO_API/eliminar-ofertas-caducadas");

    if (response.data.success) {
      console.log("✅ Ofertas caducadas eliminadas automáticamente.");
    } else {
      console.warn("⚠️ Falló la eliminación automática:", response.data.error);
    }
  } catch (error) {
    console.error("❌ Error al ejecutar eliminación automática:", error.message);
  }
});
