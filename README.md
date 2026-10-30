# 🌯 AlgeKebab | La Ruta del Kebab de Algeciras

Aplicación web colaborativa para puntuar, rankear y debatir los kebabs de Algeciras entre amigos (Pablo, Marcos, etc.).

Diseñada especialmente para desplegarse en **Render** con base de datos compartida y sesiones persistentes (inicias una vez en el móvil o PC y no se te cierra la sesión).

---

## 🚀 Características Principales

1. **Kebabs Reales de Algeciras Pre-cargados**:
   - **Kebab La Isla (Comida Rápida)** en C/ Sindicalista Luis Cobos (Zona Puerto / Isla Verde).
   - **Kebab Dchiqui** (Av. Europa, Las Palomas).
   - **Turkish Kebab Algeciras** (Av. Virgen del Carmen).
   - **King Döner Kebab y Pizza** (Av. Virgen del Carmen).
   - **Mi Casa Döner Kebab** (Paseo Marítimo de Getares / San García).
   - **Original Kebab** (C.C. Puerta Europa).
   - **El Palacio Comida Rápida** (C/ Sindicalista Luis Cobos).
   - **Tasty's Algeciras** (Av. Europa / San García).
   - *Posibilidad de añadir cualquier nuevo local con el botón "+ Nuevo Kebab".*

2. **Cuentas y Sesión Persistente (Multi-dispositivo)**:
   - Registro e inicio de sesión con usuario y contraseña.
   - Token JWT guardado en `localStorage`: no pide contraseña cada vez que entras.
   - Los usuarios pueden **cambiar su nombre de usuario y su contraseña** en cualquier momento desde su perfil.
   - Cuentas iniciales listas para probar: `Pablo` (clave: `pablo123`) y `Marcos` (clave: `marcos123`), o crea la tuya directamente.

3. **Puntuación Desglosada con Fórmula Ponderada**:
   - Cada amigo puntúa del 0 al 10 con sliders de precisión decimal (ej: 8.2).
   - Criterios actuales:
     - 🌯 **Carne y Kebab**: 50%
     - 📍 **Ubicación y Local**: 15%
     - 📦 **Presentación y Empaque**: 15%
     - 🍟 **Salsas y Patatas**: 10%
     - 💶 **Calidad / Precio**: 10%
   - **Fórmula 100% modular**: en cuanto pases los porcentajes exactos que queráis usar, se cambian en un solo archivo (`server/formula.js` y `client/src/utils/formula.js`).

4. **Vista General y Desglose por Usuario**:
   - Tarjetas con la nota media del kebab y píldoras con las notas individuales de cada amigo (ej: `Pablo: 8.2`, `Marcos: 8.0`).
   - Al hacer clic en un kebab, se despliega la ficha completa con las notas detalladas de cada amigo, gráficos de barras por criterio y comentarios/veredicto personal.

---

## 🛠️ Cómo Probarlo en Local

1. Instala las dependencias y compila el frontend:
   ```bash
   npm install
   npm run build
   ```

2. Arranca el servidor:
   ```bash
   npm start
   ```

3. Abre en tu navegador:
   `http://localhost:3001`

*(Nota: mientras no configures una base de datos PostgreSQL externa, la app guarda todo automáticamente en un archivo local `data/local_db.json`, por lo que puedes probarla ya mismo).*

---

## 🌐 Cómo Subirlo a Render y Conectar la Base de Datos

### Paso 1: Crear la Base de Datos
Puedes usar:
- **Supabase** (Recomendado, gratuito y rápido: [supabase.com](https://supabase.com)).
- **Neon** ([neon.tech](https://neon.tech)).
- **Render PostgreSQL** (directamente desde tu panel de Render).

En el editor SQL de tu base de datos, pega y ejecuta todo el contenido del archivo:
👉 `database.sql`
*(Crea las tablas de usuarios, kebabs y puntuaciones, e inserta los kebabs de Algeciras).*

### Paso 2: Crear el Web Service en Render
1. Sube este repositorio a tu GitHub.
2. Entra en [render.com](https://render.com) y pulsa **New + > Web Service**.
3. Conecta tu repositorio de GitHub `Kebab`.
4. Render detectará automáticamente la configuración o introduce:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. En la sección **Environment Variables**, añade:
   - `DATABASE_URL`: La URL de conexión de tu base de datos PostgreSQL (ej: `postgres://postgres:...@...supabase.co:5432/postgres` o tu Render Postgres URL).
   - `JWT_SECRET`: Cualquier frase secreta larga para la seguridad de las sesiones.
6. Pulsa **Deploy Web Service**. ¡Listo! Tendrás tu enlace público para compartirlo con Marcos, Pablo y los demás amigos.
