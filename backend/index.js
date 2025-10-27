const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const solicitudColaboradorRoutes = require("./routes/solicitudColaborador");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Activar rutas
app.use("/api", solicitudColaboradorRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("✅ Backend Finedu activo");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
