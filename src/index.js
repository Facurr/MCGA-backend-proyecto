require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes"); // ✅ Verifica que esté en la carpeta correcta

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Permite solicitudes desde cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error en la conexión a MongoDB:", err);
    process.exit(1); // Detiene el servidor si no se puede conectar a la base de datos
  });

// Ruta raíz para verificar si el backend funciona
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando correctamente en Vercel");
});

// Rutas de la API
app.use("/api", routes); // Todas las rutas estarán bajo `/api`

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));

// Exportar la app para compatibilidad con Vercel
module.exports = app;