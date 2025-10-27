const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Rutas institucionales
const solicitudColaboradorRoutes = require("./routes/solicitudColaborador");
const ofertasRoutes = require("./routes/ofertas");
const aportesRoutes = require("./routes/aportes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Activar rutas institucionales
app.use("/api", solicitudColaboradorRoutes);
app.use("/api", ofertasRoutes);
app.use("/api", aportesRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("✅ Backend Finedu activo");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
