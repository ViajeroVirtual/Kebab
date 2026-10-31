require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, supabase, pool, dbMode, readLocalDb, writeLocalDb } = require('./db');
const { startKeepAlive } = require('./keepAlive');

const { router: authRouter } = require('./routes/auth');
const kebabsRouter = require('./routes/kebabs');
const ratingsRouter = require('./routes/ratings');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/kebabs', kebabsRouter);
app.use('/api/ratings', ratingsRouter);

// Endpoint Keep-Alive / Health check (útil para Render y monitores externos como UptimeRobot)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AlgeKebab API', timestamp: new Date().toISOString() });
});

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Servir frontend compilado en producción (cuando se despliega en Render)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  const indexHtml = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.json({
      message: 'AlgeKebab API funcionando correctamente.',
      frontend: 'El frontend aún no está compilado. Ejecuta npm run dev para desarrollo o npm run build.'
    });
  }
});

// Arrancar servidor e inicializar DB + Bot Keep-Alive
const HOST = process.env.IP || (process.env.NODE_ENV === 'production' ? '::' : '0.0.0.0');

initDb().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`===============================================`);
    console.log(`🥙 Servidor AlgeKebab escuchando en ${HOST}:${PORT}`);
    console.log(`🚀 Listo para Alwaysdata, Render o desarrollo local`);
    console.log(`===============================================`);

    // Iniciar bot de películas invisible para mantener activo Supabase
    startKeepAlive({ supabase, pool, dbMode, readLocalDb, writeLocalDb });
  });
}).catch(err => {
  console.error('Error al iniciar el servidor:', err);
});
