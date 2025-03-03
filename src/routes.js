const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getItems,
  createItem,
  updateItem,
  deleteItem,
} = require("./controllers");
const authMiddleware = require("./middleware");

// Rutas de autenticación
router.post("/register", registerUser); // Registrar usuario
router.post("/login", loginUser); // Iniciar sesión

// Rutas del CRUD (protección con middleware)
router.get("/items", getItems); // Obtener todos los items (público)
router.post("/items", authMiddleware, createItem); // Crear item (requiere autenticación)
router.put("/items/:id", authMiddleware, updateItem); // Actualizar item (requiere autenticación)
router.delete("/items/:id", authMiddleware, deleteItem); // Eliminar item (requiere autenticación)

module.exports = router;
