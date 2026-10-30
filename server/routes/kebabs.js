const express = require('express');
const router = express.Router();
const { getAllKebabsWithRatings, addKebab } = require('../db');
const { authenticateToken } = require('./auth');

// 1. Obtener todos los kebabs con sus puntuaciones y detalles
router.get('/', async (req, res) => {
  try {
    const kebabs = await getAllKebabsWithRatings();
    return res.json(kebabs);
  } catch (err) {
    console.error('Error fetching kebabs:', err);
    res.status(500).json({ error: 'Error al obtener la lista de kebabs.' });
  }
});

// 2. Obtener un kebab concreto por ID
router.get('/:id', async (req, res) => {
  try {
    const kebabId = parseInt(req.params.id);
    const kebabs = await getAllKebabsWithRatings();
    const kebab = kebabs.find(k => k.id === kebabId);
    if (!kebab) return res.status(404).json({ error: 'Kebab no encontrado' });
    return res.json(kebab);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar kebab.' });
  }
});

// 3. Añadir nuevo kebab
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, address, zone, google_maps_url, description, image_url } = req.body;

    if (!name || !zone) {
      return res.status(400).json({ error: 'El nombre y la zona en Algeciras son obligatorios.' });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80';

    const newKebab = await addKebab({
      name,
      address: address || 'Algeciras',
      zone,
      google_maps_url: google_maps_url || '',
      description: description || '',
      image_url: image_url || defaultImage
    });

    return res.status(201).json(newKebab);
  } catch (err) {
    console.error('Error creating kebab:', err);
    res.status(500).json({ error: 'Error al registrar nuevo kebab.' });
  }
});

module.exports = router;
