// ============================================================
// BOT DE KEEP-ALIVE (CINEBOT INVISIBLE)
// ============================================================
// Este bot escribe periódicamente en Supabase (cada 5 minutos)
// un título de película aleatorio para que Supabase registre actividad
// constante y NUNCA se pause ni se apague por inactividad.
// Es 100% invisible para los usuarios de la web.

const MOVIES = [
  'El Padrino',
  'Pulp Fiction',
  'El Gran Lebowski',
  'Matrix',
  'Interstellar',
  'Gladiator',
  'Uno de los nuestros',
  'El Club de la Lucha',
  'Blade Runner 2049',
  'Scarface',
  'El Bueno, el Feo y el Malo',
  'Origen (Inception)',
  'Casino',
  'Reservoir Dogs',
  'El Caballero Oscuro',
  'Seven',
  'Terminator 2',
  'Parásitos',
  'Apocalypse Now',
  'Memento'
];

let pingCount = 0;

function getRandomMovie() {
  const idx = Math.floor(Math.random() * MOVIES.length);
  return MOVIES[idx];
}

function startKeepAlive({ supabase, pool, dbMode, readLocalDb, writeLocalDb }) {
  const INTERVAL_MS = 5 * 60 * 1000; // Cada 5 minutos

  console.log('🤖 Bot Keep-Alive (CineBot) iniciado: enviará actividad a Supabase cada 5 minutos.');

  // Ejecución periódica
  const timer = setInterval(async () => {
    pingCount++;
    const movie = getRandomMovie();
    const timestamp = new Date().toISOString();

    try {
      if (dbMode === 'supabase' && supabase) {
        // Escribir en la tabla invisible _keep_alive de Supabase
        const { error } = await supabase
          .from('_keep_alive')
          .upsert([
            {
              id: 1,
              movie,
              last_ping: timestamp,
              ping_count: pingCount,
              note: 'Ping automático para evitar suspensión de Supabase'
            }
          ], { onConflict: 'id' });

        if (error) {
          // Si la tabla _keep_alive aún no ha sido creada en SQL Editor, hacer un select ligero
          const { error: fallbackErr } = await supabase.from('kebabs').select('id').limit(1);
          if (fallbackErr) {
            console.warn(`[🤖 CineBot] Aviso al registrar actividad:`, fallbackErr.message);
          } else {
            console.log(`[🤖 CineBot #${pingCount}] Actividad registrada en Supabase: "${movie}"`);
          }
        } else {
          console.log(`[🤖 CineBot #${pingCount}] Película registrada en Supabase: "${movie}" (Supabase Activo ✅)`);
        }
      } else if (dbMode === 'postgres' && pool) {
        await pool.query(`
          INSERT INTO _keep_alive (id, movie, last_ping, ping_count)
          VALUES (1, $1, NOW(), $2)
          ON CONFLICT (id) DO UPDATE SET movie = $1, last_ping = NOW(), ping_count = $2
        `, [movie, pingCount]);
        console.log(`[🤖 CineBot #${pingCount}] Película registrada en PostgreSQL: "${movie}" ✅`);
      } else {
        // Modo local
        const db = readLocalDb();
        db._keep_alive = { id: 1, movie, last_ping: timestamp, ping_count: pingCount };
        writeLocalDb(db);
      }
    } catch (err) {
      console.warn(`[🤖 CineBot] Error enviando ping:`, err.message);
    }
  }, INTERVAL_MS);

  // Ejecutar el primer ping a los 10 segundos para confirmar que funciona
  setTimeout(async () => {
    const movie = getRandomMovie();
    console.log(`[🤖 CineBot] Primer ping de prueba programado con "${movie}"...`);
  }, 10000);

  return timer;
}

module.exports = { startKeepAlive };
