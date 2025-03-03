const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getItems,
  createItem,
  updateItem,
  deleteItem,
} = require("./controllers/controllers"); // ⚠️ Verifica si controllers.js está en la carpeta correcta

const authMiddleware = require("./middleware/middleware"); // ⚠️ Verifica si middleware.js está en la carpeta correcta

// Rutas de autenticación (sin autenticación)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Rutas del CRUD (protegidas con middleware excepto "getItems")
router.get("/items", getItems); // Público
router.post("/items", authMiddleware, createItem); // Protegido
router.put("/items/:id", authMiddleware, updateItem); // Protegido
router.delete("/items/:id", authMiddleware, deleteItem); // Protegido

module.exports = router;