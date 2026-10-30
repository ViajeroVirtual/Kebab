-- ============================================================
-- ESQUEMA DE BASE DE DATOS: RUTA DEL KEBAB ALGECIRAS
-- Compatible con PostgreSQL / Supabase / Neon / Render Postgres
-- ============================================================

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_color VARCHAR(20) DEFAULT '#f59e0b',
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Kebabs (Establecimientos en Algeciras)
CREATE TABLE IF NOT EXISTS kebabs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    google_maps_url TEXT,
    description TEXT,
    image_url TEXT,
    phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Puntuaciones y Reseñas
-- Criterios oficiales:
-- Kebab: 6 ptos máx | Ubicación: 1 pto máx | Atención del moro: 1 pto máx
-- Calidad-Precio: 1 pto máx | Local-Presentación: 1 pto máx
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    kebab_id INTEGER REFERENCES kebabs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    kebab_score NUMERIC(3, 1) NOT NULL CHECK (kebab_score >= 0 AND kebab_score <= 10),
    ubicacion_score NUMERIC(3, 1) NOT NULL CHECK (ubicacion_score >= 0 AND ubicacion_score <= 10),
    atencion_score NUMERIC(3, 1) NOT NULL CHECK (atencion_score >= 0 AND atencion_score <= 10),
    calidad_precio_score NUMERIC(3, 1) NOT NULL CHECK (calidad_precio_score >= 0 AND calidad_precio_score <= 10),
    local_presentacion_score NUMERIC(3, 1) NOT NULL CHECK (local_presentacion_score >= 0 AND local_presentacion_score <= 10),
    final_score NUMERIC(3, 1) NOT NULL CHECK (final_score >= 0 AND final_score <= 10),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_kebab UNIQUE (kebab_id, user_id)
);

-- 4. Tabla de Keep-Alive (Evita que Supabase se pause por inactividad)
-- Un bot invisible escribe una película aquí cada 5 minutos
CREATE TABLE IF NOT EXISTS _keep_alive (
    id INTEGER PRIMARY KEY DEFAULT 1,
    movie VARCHAR(255) NOT NULL,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ping_count INTEGER DEFAULT 1,
    note TEXT
);

-- ============================================================
-- DATOS INICIALES: KEBABS EN ALGECIRAS
-- ============================================================

INSERT INTO kebabs (id, name, address, zone, google_maps_url, description, image_url) VALUES
(
    1,
    'Kebab La Isla (Comida Rápida)',
    'Calle Sindicalista Luis Cobos',
    'Zona Puerto / Isla Verde',
    'https://maps.google.com/?q=La+Isla+Comida+Rapida+Algeciras',
    'Mítico punto de reunión con dürüms bien cargados, shawarma y opciones clásicas.',
    'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
),
(
    2,
    'Kebab Dchiqui',
    'Av. Europa, 2 (Edif. Las Palomas)',
    'Las Palomas',
    'https://maps.google.com/?q=Kebab+Dchiqui+Algeciras',
    'Considerado por muchos de los mejores de Algeciras y Campo de Gibraltar. Salsas caseras insuperables.',
    'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
),
(
    3,
    'Turkish Kebab Algeciras',
    'Av. Virgen del Carmen, 33',
    'Zona Puerto / Centro',
    'https://maps.google.com/?q=Turkish+Kebab+Algeciras',
    'Gran cantidad de carne sabrosa y salsa picante auténtica muy potente.',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
),
(
    4,
    'King Döner Kebab y Pizza',
    'Av. Virgen del Carmen, 29',
    'Zona Puerto',
    'https://maps.google.com/?q=King+Doner+Kebab+Algeciras',
    'Destaca por sus patatas fritas naturales e ingredientes frescos que marcan la diferencia.',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80'
),
(
    5,
    'Mi Casa Döner Kebab',
    'Paseo Marítimo de Getares',
    'Getares / San García',
    'https://maps.google.com/?q=Mi+Casa+Doner+Kebab+Getares+Algeciras',
    'Perfecto para cenar frente a la playa o en la zona sur. Dürüms y bandejas con queso.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
),
(
    6,
    'Original Kebab',
    'C.C. Puerta Europa (Planta Alta)',
    'Puerta Europa',
    'https://maps.google.com/?q=Original+Kebab+Puerta+Europa+Algeciras',
    'Ideal tras tarde de compras o cine. Menús completos de dürum y platos turcos.',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80'
),
(
    7,
    'El Palacio Comida Rápida',
    'Calle Sindicalista Luis Cobos, 5',
    'Zona Puerto / Bajadilla',
    'https://maps.google.com/?q=El+Palacio+Comida+Rapida+Algeciras',
    'Shawarmas sabrosos, camperos y especialidades con trato muy cercano y limpio.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
),
(
    8,
    'Tasty''s Algeciras',
    'Av. Europa / San García',
    'San García / Europa',
    'https://maps.google.com/?q=Tasty+Algeciras',
    'Fusión de tacos franceses con salsa de queso y döner kebab con toque moderno.',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- Resetear secuencia para nuevos kebabs que se añadan dinámicamente
SELECT setval(pg_get_serial_sequence('kebabs', 'id'), coalesce(max(id), 1)) FROM kebabs;
