const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findUserByUsername,
  findUserById,
  createUser,
  updateUser
} = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'algekebab-super-secret-key-2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Inicia sesión.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Sesión expirada o token inválido.' });
    }
    req.user = user;
    next();
  });
}

// 1. Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios.' });
    }

    if (username.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 2 caracteres.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres.' });
    }

    const cleanUsername = username.trim();
    const existing = await findUserByUsername(cleanUsername);
    if (existing) {
      return res.status(400).json({ error: 'Ese nombre de usuario ya está cogido. Elige otro.' });
    }

    const colors = ['#f97316', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username: cleanUsername,
      display_name: cleanUsername,
      password_hash: passwordHash,
      avatar_color: randomColor
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '365d' });
    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Introduce usuario y contraseña.' });
    }

    const cleanUsername = username.trim();
    const user = await findUserByUsername(cleanUsername);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '365d' });
    const { password_hash, ...safeUser } = user;

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

// 3. Usuario actual
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    return res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la sesión.' });
  }
});

// 4. Actualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { new_username, new_password, current_password } = req.body;
    const userId = req.user.id;

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si envía current_password verificarla
    if (current_password) {
      const fullUser = await findUserByUsername(user.username);
      const valid = await bcrypt.compare(current_password, fullUser.password_hash);
      if (!valid) return res.status(400).json({ error: 'La contraseña actual no es correcta.' });
    }

    let updatedUsername = user.username;
    let updatedHash = undefined;

    if (new_username && new_username.trim() !== user.username) {
      const cleanNew = new_username.trim();
      const check = await findUserByUsername(cleanNew);
      if (check && check.id !== userId) {
        return res.status(400).json({ error: 'Ese nombre de usuario ya está en uso.' });
      }
      updatedUsername = cleanNew;
    }

    if (new_password) {
      if (new_password.length < 4) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      updatedHash = await bcrypt.hash(new_password, 10);
    }

    const updated = await updateUser(userId, {
      username: updatedUsername,
      password_hash: updatedHash
    });

    const newToken = jwt.sign({ id: userId, username: updatedUsername }, JWT_SECRET, { expiresIn: '365d' });
    return res.json({ user: updated, token: newToken, message: 'Perfil actualizado correctamente.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
});

module.exports = { router, authenticateToken };
