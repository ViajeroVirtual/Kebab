const express = require('express');
const router = express.Router();
const { saveRating, deleteRating } = require('../db');
const { authenticateToken } = require('./auth');
const { calculateFinalScore } = require('../formula');

// Crear o actualizar la puntuación del usuario actual para un kebab
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      kebab_id,
      kebab_score,
      ubicacion_score,
      atencion_score,
      calidad_precio_score,
      local_presentacion_score,
      comment
    } = req.body;

    if (!kebab_id) {
      return res.status(400).json({ error: 'Debes indicar el kebab que estás puntuando.' });
    }

    const scores = {
      kebab_score: Math.min(10, Math.max(0, parseFloat(kebab_score) || 0)),
      ubicacion_score: Math.min(10, Math.max(0, parseFloat(ubicacion_score) || 0)),
      atencion_score: Math.min(10, Math.max(0, parseFloat(atencion_score) || 0)),
      calidad_precio_score: Math.min(10, Math.max(0, parseFloat(calidad_precio_score) || 0)),
      local_presentacion_score: Math.min(10, Math.max(0, parseFloat(local_presentacion_score) || 0))
    };

    const final_score = calculateFinalScore(scores);

    const saved = await saveRating({
      kebab_id: parseInt(kebab_id),
      user_id: userId,
      ...scores,
      final_score,
      comment: comment || ''
    });

    return res.json({ rating: saved, message: '¡Puntuación guardada con éxito!' });
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: 'Error al registrar la puntuación.' });
  }
});

// Eliminar la puntuación de un usuario para un kebab
router.delete('/:kebab_id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const kebabId = parseInt(req.params.kebab_id);

    await deleteRating(kebabId, userId);
    return res.json({ message: 'Puntuación eliminada.' });
  } catch (err) {
    console.error('Error deleting rating:', err);
    res.status(500).json({ error: 'Error al eliminar la puntuación.' });
  }
});

module.exports = router;
