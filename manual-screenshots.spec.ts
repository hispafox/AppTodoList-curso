import { test } from '@playwright/test';

const BASE = 'http://localhost:5173';
const OUT = 'docs/manual/img';

// Configuración común: todas las capturas salen iguales, sin excepción.
// Si cada una sale con un ancho distinto, el manual parece un collage.
test.use({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,        // capturas nítidas en pantallas HiDPI
  colorScheme: 'light',        // tema consistente; pon 'dark' para la variante oscura
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
});

const opciones = {
  fullPage: true,
  animations: 'disabled' as const, // congela transiciones y spinners
};

test('capturas del manual de usuario', async ({ page }) => {
  // 1. Listado de tareas — la pantalla principal
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/01-tareas.png`, ...opciones });

  // 2. Categorías
  await page.goto(`${BASE}/categorias`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/02-categorias.png`, ...opciones });

  // 3. Plantillas de tareas recurrentes
  await page.goto(`${BASE}/plantillas`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/03-plantillas.png`, ...opciones });

  // 4. Usuarios asignados
  await page.goto(`${BASE}/usuarios`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/04-usuarios.png`, ...opciones });
});
