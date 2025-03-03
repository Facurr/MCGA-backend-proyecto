require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./src/routes"); // Importar rutas

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Error en la conexión a MongoDB:", err));

// Ruta raíz para verificar si el backend funciona
app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando correctamente en Vercel");
});

// Rutas de la API
app.use("/api", routes); // Todas las rutas estarán bajo `/api`

// Configurar el puerto para que Vercel lo tome automáticamente
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));

// Exportar la app para compatibilidad con Vercel
module.exports = app;



