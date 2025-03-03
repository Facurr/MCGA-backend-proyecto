const { User, Item } = require("./models"); // Asegúrate de que models.js está en la carpeta correcta
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📌 Función para registrar usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log("🔹 Intentando registrar usuario...");
    console.log("📧 Email recibido:", email);
    console.log("🔑 Contraseña ingresada:", password);

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ El usuario ya existe en la BD");
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log("✅ Contraseña encriptada correctamente:", hashedPassword);

    // Crear el usuario con la contraseña encriptada
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("✅ Usuario registrado con éxito:", user);
    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Función para iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Intentando login...");
    console.log("📧 Email recibido:", email);
    console.log("🔑 Contraseña ingresada:", password);

    // Buscar usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Usuario NO encontrado en BD");
      return res.status(400).json({ message: "❌ Usuario no encontrado" });
    }

    console.log("✅ Usuario encontrado en BD:", user);
    console.log("🔑 Contraseña en BD (encriptada):", user.password);

    // Comparar contraseñas
    console.log("🛠️ Tipo de password ingresado:", typeof password);
    console.log("🛠️ Tipo de password en BD:", typeof user.password);
    console.log("🛠️ Longitud password ingresado:", password.length);
    console.log("🛠️ Longitud password en BD:", user.password.length);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Resultado bcrypt.compare:", isMatch);

    if (!isMatch) {
      console.log("❌ Contraseña incorrecta");
      return res.status(400).json({ message: "❌ Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Login exitoso, Token generado:", token);
    res.json({ token, userId: user._id, name: user.name });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// 📌 Obtener todos los items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los items", error });
  }
};

// 📌 Crear un nuevo item
const createItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newItem = new Item({ name, description, price, user: req.userId });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el item", error });
  }
};

// 📌 Actualizar un item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el item", error });
  }
};

// 📌 Eliminar un item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.json({ message: "Item eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el item", error });
  }
};

// 📌 Exportar todas las funciones correctamente
module.exports = { registerUser, loginUser, getItems, createItem, updateItem, deleteItem };

