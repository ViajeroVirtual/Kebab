const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://la-ruta-del-kebab:Villamil2412@postgresql-la-ruta-del-kebab.alwaysdata.net:5432/la-ruta-del-kebab_kebab';

let supabase = null;
let pool = null;

let dbMode = 'local'; // 'supabase' | 'postgres' | 'local'

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    dbMode = 'supabase';
    console.log('⚡ Conectando a Supabase mediante API Client:', SUPABASE_URL);
  } catch (e) {
    console.error('Error configurando Supabase client:', e.message);
  }
} else if (DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    dbMode = 'postgres';
    console.log('🐘 Conectando a PostgreSQL mediante conexión directa');
  } catch (e) {
    console.error('Error configurando PostgreSQL pool:', e.message);
  }
} else {
  console.log('📁 Modo base de datos: Almacenamiento local (JSON). Esperando credenciales de Supabase o Render.');
}

const localDbPath = path.join(__dirname, '../data/local_db.json');

const INITIAL_KEBABS = [
  {
    id: 1,
    name: 'Kebab La Isla (Comida Rápida)',
    address: 'Calle Sindicalista Luis Cobos',
    zone: 'Zona Puerto / Isla Verde',
    google_maps_url: 'https://maps.google.com/?q=La+Isla+Comida+Rapida+Algeciras',
    description: 'Mítico punto de reunión con dürüms bien cargados, shawarma y opciones clásicas.',
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Kebab Dchiqui',
    address: 'Av. Europa, 2 (Edif. Las Palomas)',
    zone: 'Las Palomas',
    google_maps_url: 'https://maps.google.com/?q=Kebab+Dchiqui+Algeciras',
    description: 'Considerado por muchos de los mejores de Algeciras y Campo de Gibraltar. Salsas caseras insuperables.',
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Turkish Kebab Algeciras',
    address: 'Av. Virgen del Carmen, 33',
    zone: 'Zona Puerto / Centro',
    google_maps_url: 'https://maps.google.com/?q=Turkish+Kebab+Algeciras',
    description: 'Gran cantidad de carne sabrosa y salsa picante auténtica muy potente.',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'King Döner Kebab y Pizza',
    address: 'Av. Virgen del Carmen, 29',
    zone: 'Zona Puerto',
    google_maps_url: 'https://maps.google.com/?q=King+Doner+Kebab+Algeciras',
    description: 'Destaca por sus patatas fritas naturales e ingredientes frescos que marcan la diferencia.',
    image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Mi Casa Döner Kebab',
    address: 'Paseo Marítimo de Getares',
    zone: 'Getares / San García',
    google_maps_url: 'https://maps.google.com/?q=Mi+Casa+Doner+Kebab+Getares+Algeciras',
    description: 'Perfecto para cenar frente a la playa o en la zona sur. Dürüms y bandejas con queso.',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Original Kebab',
    address: 'C.C. Puerta Europa (Planta Alta)',
    zone: 'Puerta Europa',
    google_maps_url: 'https://maps.google.com/?q=Original+Kebab+Puerta+Europa+Algeciras',
    description: 'Ideal tras tarde de compras o cine. Menús completos de dürum y platos turcos.',
    image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'El Palacio Comida Rápida',
    address: 'Calle Sindicalista Luis Cobos, 5',
    zone: 'Zona Puerto / Bajadilla',
    google_maps_url: 'https://maps.google.com/?q=El+Palacio+Comida+Rapida+Algeciras',
    description: 'Shawarmas sabrosos, camperos y especialidades con trato muy cercano y limpio.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Tasty\'s Algeciras',
    address: 'Av. Europa / San García',
    zone: 'San García / Europa',
    google_maps_url: 'https://maps.google.com/?q=Tasty+Algeciras',
    description: 'Fusión de tacos franceses con salsa de queso y döner kebab con toque moderno.',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  }
];

function readLocalDb() {
  const dir = path.dirname(localDbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(localDbPath)) {
    const salt = bcrypt.genSaltSync(10);
    const viajeroHash = bcrypt.hashSync('viajero123', salt);
    const marcosHash = bcrypt.hashSync('Marcos123', salt);

    const initialData = {
      users: [
        {
          id: 1,
          username: 'Viajero',
          display_name: 'Viajero',
          password_hash: viajeroHash,
          avatar_color: '#f97316',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          username: 'Marcos',
          display_name: 'Marcos',
          password_hash: marcosHash,
          avatar_color: '#10b981',
          created_at: new Date().toISOString()
        }
      ],
      kebabs: INITIAL_KEBABS,
      ratings: [
        {
          id: 1,
          kebab_id: 1,
          user_id: 1,
          kebab_score: 6.7,
          ubicacion_score: 10.0,
          atencion_score: 10.0,
          calidad_precio_score: 4.0,
          local_presentacion_score: 3.0,
          final_score: 6.7,
          comment: 'Kebab 4/6, Ubicación 1/1, Atención y Servicio 1/1, Calidad-Precio 0.4/1, Local-Presentación 0.3/1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          kebab_id: 1,
          user_id: 2,
          kebab_score: 6.7,
          ubicacion_score: 10.0,
          atencion_score: 10.0,
          calidad_precio_score: 3.5,
          local_presentacion_score: 7.5,
          final_score: 7.1,
          comment: 'Kebab 4/6, Ubicación 1/1, Atención y Servicio 1/1, Calidad-Precio 0.35/1, Local-Presentación 0.75/1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };

    fs.writeFileSync(localDbPath, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(localDbPath, 'utf-8');
    const data = JSON.parse(raw);
    let changed = false;
    if (Array.isArray(data.users)) {
      data.users.forEach(u => {
        if (u.username === 'Pablo' || u.display_name === 'Pablo') {
          u.username = 'Viajero';
          u.display_name = 'Viajero';
          changed = true;
        }
      });
    }
    if (Array.isArray(data.ratings)) {
      data.ratings.forEach(r => {
        if (typeof r.comment === 'string' && r.comment.includes('Atención del moro')) {
          r.comment = r.comment.replace(/Atención del moro/g, 'Atención y Servicio');
          changed = true;
        }
      });
    }
    if (changed) {
      fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch (err) {
    return { users: [], kebabs: INITIAL_KEBABS, ratings: [] };
  }
}

function writeLocalDb(data) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function initDb() {
  if (dbMode === 'supabase') {
    console.log('✅ Supabase configurado. Verifica que has ejecutado database.sql en el SQL Editor de Supabase.');
  } else if (dbMode === 'postgres') {
    console.log('Iniciando esquema en PostgreSQL...');
    try {
      const schemaSql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf-8');
      await pool.query(schemaSql);
      console.log('Tablas PostgreSQL creadas/actualizadas.');
    } catch (err) {
      console.error('Error al inicializar PostgreSQL:', err.message);
    }
  } else {
    readLocalDb();
  }
}

// ============================================================
// SERVICIOS UNIFICADOS DE BASE DE DATOS
// ============================================================

// 1. Obtener usuario por nombre
async function findUserByUsername(username) {
  const clean = username.trim().toLowerCase();
  if (dbMode === 'supabase') {
    const { data, error } = await supabase.from('users').select('*').ilike('username', clean).single();
    if (error && error.code !== 'PGRST116') console.error('Supabase findUser error:', error.message);
    return data || null;
  }
  if (dbMode === 'postgres') {
    const res = await pool.query('SELECT * FROM users WHERE LOWER(username) = $1', [clean]);
    return res.rows[0] || null;
  }
  const db = readLocalDb();
  return db.users.find(u => u.username.toLowerCase() === clean) || null;
}

// 2. Obtener usuario por ID
async function findUserById(id) {
  if (dbMode === 'supabase') {
    const { data, error } = await supabase.from('users').select('id, username, display_name, avatar_color, avatar_url, created_at').eq('id', id).single();
    return data || null;
  }
  if (dbMode === 'postgres') {
    const res = await pool.query('SELECT id, username, display_name, avatar_color, avatar_url, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  const db = readLocalDb();
  const u = db.users.find(u => u.id === id);
  if (!u) return null;
  const { password_hash, ...safe } = u;
  return safe;
}

// 2.1. Obtener usuario por ID incluyendo password_hash para comprobaciones seguras
async function findUserByIdWithPassword(id) {
  if (dbMode === 'supabase') {
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    return data || null;
  }
  if (dbMode === 'postgres') {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  const db = readLocalDb();
  return db.users.find(u => u.id === id) || null;
}

// 3. Crear usuario
async function createUser({ username, display_name, password_hash, avatar_color }) {
  if (dbMode === 'supabase') {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, display_name: display_name || username, password_hash, avatar_color }])
      .select('id, username, display_name, avatar_color')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  if (dbMode === 'postgres') {
    const res = await pool.query(
      'INSERT INTO users (username, display_name, password_hash, avatar_color) VALUES ($1, $2, $3, $4) RETURNING id, username, display_name, avatar_color',
      [username, display_name || username, password_hash, avatar_color]
    );
    return res.rows[0];
  }
  const db = readLocalDb();
  const nextId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    username,
    display_name: display_name || username,
    password_hash,
    avatar_color,
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  writeLocalDb(db);
  const { password_hash: _, ...safe } = newUser;
  return safe;
}

// 4. Actualizar usuario (nombre, contraseña, color o avatar)
async function updateUser(id, { username, password_hash, avatar_color, avatar_url }) {
  if (dbMode === 'supabase') {
    const updates = {};
    if (username) {
      updates.username = username;
      updates.display_name = username;
    }
    if (password_hash) updates.password_hash = password_hash;
    if (avatar_color) updates.avatar_color = avatar_color;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, username, display_name, avatar_color, avatar_url, created_at')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  if (dbMode === 'postgres') {
    const fields = [];
    const vals = [];
    let idx = 1;
    if (username) {
      fields.push(`username = $${idx}`, `display_name = $${idx}`);
      vals.push(username);
      idx++;
    }
    if (password_hash) {
      fields.push(`password_hash = $${idx}`);
      vals.push(password_hash);
      idx++;
    }
    if (avatar_color) {
      fields.push(`avatar_color = $${idx}`);
      vals.push(avatar_color);
      idx++;
    }
    if (avatar_url !== undefined) {
      fields.push(`avatar_url = $${idx}`);
      vals.push(avatar_url);
      idx++;
    }
    if (fields.length === 0) {
      const current = await pool.query('SELECT id, username, display_name, avatar_color, avatar_url, created_at FROM users WHERE id = $1', [id]);
      return current.rows[0];
    }
    vals.push(id);
    const q = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, username, display_name, avatar_color, avatar_url, created_at`;
    const res = await pool.query(q, vals);
    return res.rows[0];
  }
  const db = readLocalDb();
  const u = db.users.find(u => u.id === id);
  if (!u) return null;
  if (username) {
    u.username = username;
    u.display_name = username;
  }
  if (password_hash) u.password_hash = password_hash;
  if (avatar_color) u.avatar_color = avatar_color;
  if (avatar_url !== undefined) u.avatar_url = avatar_url;
  writeLocalDb(db);
  const { password_hash: _, ...safe } = u;
  return safe;
}

// 5. Obtener todos los kebabs con ratings consolidados
async function getAllKebabsWithRatings() {
  if (dbMode === 'supabase') {
    const { data: kebabs, error: kErr } = await supabase.from('kebabs').select('*').order('id', { ascending: true });
    if (kErr) throw new Error(kErr.message);

    const { data: ratings, error: rErr } = await supabase
      .from('ratings')
      .select('*, users(username, display_name, avatar_color)')
      .order('created_at', { ascending: false });
    if (rErr) throw new Error(rErr.message);

    return (kebabs || []).map(k => {
      const kRatings = (ratings || [])
        .filter(r => r.kebab_id === k.id)
        .map(r => ({
          ...r,
          username: r.users?.username || 'Amigo',
          display_name: r.users?.display_name || r.users?.username || 'Amigo',
          avatar_color: r.users?.avatar_color || '#f97316'
        }));

      const count = kRatings.length;
      const avg = count > 0 ? kRatings.reduce((acc, r) => acc + parseFloat(r.final_score), 0) / count : null;
      return {
        ...k,
        average_score: avg !== null ? Math.round(avg * 10) / 10 : null,
        ratings_count: count,
        ratings: kRatings
      };
    });
  }

  if (dbMode === 'postgres') {
    const kebabsRes = await pool.query('SELECT * FROM kebabs ORDER BY id ASC');
    const ratingsRes = await pool.query(`
      SELECT r.*, u.username, u.display_name, u.avatar_color, u.avatar_url
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    return kebabsRes.rows.map(kebab => {
      const kebabRatings = ratingsRes.rows.filter(r => r.kebab_id === kebab.id);
      const count = kebabRatings.length;
      const avg = count > 0 ? kebabRatings.reduce((acc, r) => acc + parseFloat(r.final_score), 0) / count : null;
      return {
        ...kebab,
        average_score: avg !== null ? Math.round(avg * 10) / 10 : null,
        ratings_count: count,
        ratings: kebabRatings
      };
    });
  }

  // Local JSON
  const db = readLocalDb();
  return db.kebabs.map(kebab => {
    const kebabRatings = db.ratings
      .filter(r => r.kebab_id === kebab.id)
      .map(r => {
        const user = db.users.find(u => u.id === r.user_id) || { username: 'Anónimo', avatar_color: '#9ca3af' };
        return {
          ...r,
          username: user.username,
          display_name: user.display_name || user.username,
          avatar_color: user.avatar_color || '#f59e0b'
        };
      });

    const count = kebabRatings.length;
    const avg = count > 0 ? kebabRatings.reduce((acc, r) => acc + parseFloat(r.final_score), 0) / count : null;
    return {
      ...kebab,
      average_score: avg !== null ? Math.round(avg * 10) / 10 : null,
      ratings_count: count,
      ratings: kebabRatings
    };
  });
}

// 6. Añadir nuevo kebab
async function addKebab(kebabData) {
  if (dbMode === 'supabase') {
    const { data, error } = await supabase.from('kebabs').insert([kebabData]).select('*').single();
    if (error) throw new Error(error.message);
    return { ...data, ratings: [], average_score: null, ratings_count: 0 };
  }
  if (dbMode === 'postgres') {
    const res = await pool.query(
      `INSERT INTO kebabs (name, address, zone, google_maps_url, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [kebabData.name, kebabData.address, kebabData.zone, kebabData.google_maps_url, kebabData.description, kebabData.image_url]
    );
    return { ...res.rows[0], ratings: [], average_score: null, ratings_count: 0 };
  }
  const db = readLocalDb();
  const nextId = db.kebabs.length > 0 ? Math.max(...db.kebabs.map(k => k.id)) + 1 : 1;
  const newKebab = { id: nextId, ...kebabData, created_at: new Date().toISOString() };
  db.kebabs.push(newKebab);
  writeLocalDb(db);
  return { ...newKebab, ratings: [], average_score: null, ratings_count: 0 };
}

// 7. Guardar o actualizar puntuación (Upsert)
async function saveRating(ratingData) {
  if (dbMode === 'supabase') {
    const { data, error } = await supabase
      .from('ratings')
      .upsert([ratingData], { onConflict: 'kebab_id,user_id' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  if (dbMode === 'postgres') {
    const q = `
      INSERT INTO ratings (
        kebab_id, user_id, 
        kebab_score, ubicacion_score, atencion_score, calidad_precio_score, local_presentacion_score, 
        final_score, comment, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      ON CONFLICT (kebab_id, user_id) 
      DO UPDATE SET
        kebab_score = EXCLUDED.kebab_score,
        ubicacion_score = EXCLUDED.ubicacion_score,
        atencion_score = EXCLUDED.atencion_score,
        calidad_precio_score = EXCLUDED.calidad_precio_score,
        local_presentacion_score = EXCLUDED.local_presentacion_score,
        final_score = EXCLUDED.final_score,
        comment = EXCLUDED.comment,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await pool.query(q, [
      ratingData.kebab_id,
      ratingData.user_id,
      ratingData.kebab_score,
      ratingData.ubicacion_score,
      ratingData.atencion_score,
      ratingData.calidad_precio_score,
      ratingData.local_presentacion_score,
      ratingData.final_score,
      ratingData.comment
    ]);
    return res.rows[0];
  }
  const db = readLocalDb();
  const idx = db.ratings.findIndex(r => r.kebab_id === parseInt(ratingData.kebab_id) && r.user_id === ratingData.user_id);
  const ratingObj = {
    ...ratingData,
    kebab_id: parseInt(ratingData.kebab_id),
    updated_at: new Date().toISOString()
  };
  if (idx >= 0) {
    db.ratings[idx] = { ...db.ratings[idx], ...ratingObj };
  } else {
    const nextId = db.ratings.length > 0 ? Math.max(...db.ratings.map(r => r.id)) + 1 : 1;
    db.ratings.push({ id: nextId, created_at: new Date().toISOString(), ...ratingObj });
  }
  writeLocalDb(db);
  return ratingObj;
}

// 8. Eliminar puntuación
async function deleteRating(kebabId, userId) {
  if (dbMode === 'supabase') {
    const { error } = await supabase.from('ratings').delete().match({ kebab_id: kebabId, user_id: userId });
    if (error) throw new Error(error.message);
    return true;
  }
  if (dbMode === 'postgres') {
    await pool.query('DELETE FROM ratings WHERE kebab_id = $1 AND user_id = $2', [kebabId, userId]);
    return true;
  }
  const db = readLocalDb();
  db.ratings = db.ratings.filter(r => !(r.kebab_id === kebabId && r.user_id === userId));
  writeLocalDb(db);
  return true;
}

module.exports = {
  supabase,
  pool,
  dbMode,
  readLocalDb,
  writeLocalDb,
  initDb,
  findUserByUsername,
  findUserById,
  findUserByIdWithPassword,
  createUser,
  updateUser,
  getAllKebabsWithRatings,
  addKebab,
  saveRating,
  deleteRating
};
