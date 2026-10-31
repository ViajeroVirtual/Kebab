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
    avatar_url TEXT,
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
    'https://img02.restaurantguru.com/c6fa-La-Isla-Comida-Rapida-Algeciras-meals.jpg'
),
(
    2,
    'Kebab Dchiqui',
    'Av. Europa, 2 (Edif. Las Palomas)',
    'Las Palomas',
    'https://maps.google.com/?q=Kebab+Dchiqui+Algeciras',
    'Considerado por muchos de los mejores de Algeciras y Campo de Gibraltar. Salsas caseras insuperables.',
    'https://img3.restaurantguru.com/rests/original/104_569580233.jpg'
),
(
    3,
    'Turkish Kebab Algeciras',
    'Av. Virgen del Carmen, 33',
    'Zona Puerto / Centro',
    'https://maps.google.com/?q=Turkish+Kebab+Algeciras',
    'Gran cantidad de carne sabrosa y salsa picante auténtica muy potente.',
    'https://lh3.googleusercontent.com/p/AF1QipNTcWwsOvowsms3d2_lnKHIOfY91Z3IO8JDexDh'
),
(
    4,
    'King Döner Kebab y Pizza',
    'Av. Virgen del Carmen, 29',
    'Zona Puerto',
    'https://maps.google.com/?q=King+Doner+Kebab+Algeciras',
    'Destaca por sus patatas fritas naturales e ingredientes frescos que marcan la diferencia.',
    'https://d1e4mqw8kzyykz.cloudfront.net/img/auto/king-doner-kebab--pizzeria-6y48nx2t-banner.jpg'
),
(
    5,
    'Mi Casa Döner Kebab',
    'Paseo Marítimo de Getares',
    'Getares / San García',
    'https://maps.google.com/?q=Mi+Casa+Doner+Kebab+Getares+Algeciras',
    'Perfecto para cenar frente a la playa o en la zona sur. Dürüms y bandejas con queso.',
    'https://res.cloudinary.com/just-eat-prod-eu/image/upload/c_thumb,w_800,h_500/f_auto/q_auto/v1/es/restaurants/87520'
),
(
    6,
    'Original Kebab',
    'C.C. Puerta Europa (Planta Alta)',
    'Puerta Europa',
    'https://maps.google.com/?q=Original+Kebab+Puerta+Europa+Algeciras',
    'Ideal tras tarde de compras o cine. Menús completos de dürum y platos turcos.',
    'https://ccpuertaeuropa.com/wp-content/uploads/2024/02/ORIGINAL_KEBAB_mobile.jpg'
),
(
    7,
    'El Palacio Comida Rápida',
    'Calle Sindicalista Luis Cobos, 5',
    'Zona Puerto / Bajadilla',
    'https://maps.google.com/?q=El+Palacio+Comida+Rapida+Algeciras',
    'Shawarmas sabrosos, camperos y especialidades con trato muy cercano y limpio.',
    'https://img3.restaurantguru.com/w550/h367/r240-El-palacio-comida-rapida-interior.jpg'
),
(
    8,
    'Tasty''s Algeciras',
    'Av. Europa / San García',
    'San García / Europa',
    'https://maps.google.com/?q=Tasty+Algeciras',
    'Fusión de tacos franceses con salsa de queso y döner kebab con toque moderno.',
    'https://static.wixstatic.com/media/81c17f_64d248d315f946b186887b41d1960d81~mv2.jpeg'
)
ON CONFLICT (id) DO NOTHING;

-- Resetear secuencia para nuevos kebabs que se añadan dinámicamente
SELECT setval(pg_get_serial_sequence('kebabs', 'id'), coalesce(max(id), 1)) FROM kebabs;
