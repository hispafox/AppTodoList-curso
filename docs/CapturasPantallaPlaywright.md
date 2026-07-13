# Capturas de pantalla automáticas con Playwright + GitHub Copilot

> Cómo dejar de hacer capturas a mano para el manual de usuario y montar un sistema que las regenera solo cada vez que cambia la UI.

---

## El problema real (que no es "hacer una captura")

Hacer una captura es trivial. Tienes la tecla *Impr Pant* desde 1995.

El problema de verdad llega después: cambias un botón, mueves un menú, traduces la app al catalán… y de golpe las 40 capturas del manual están desactualizadas. Y nadie quiere repetirlas a mano una por una, recortando, alineando y renombrando. Así que el manual envejece, muestra una versión de la app que ya no existe, y el usuario se pierde.

La idea aquí es otra: que las capturas sean **código**. Que vivan en tu repo, que se regeneren con un comando, y que cuando la UI cambie solo tengas que volver a ejecutar el script. Playwright pone el navegador; Copilot te escribe (y mantiene) ese script casi sin que tú toques una línea.

Vamos a ello.

---

## Dos formas de usar Playwright con Copilot (y cuál es para ti)

Esto es lo primero que conviene tener claro, porque mucha gente se queda en la primera y es la que **no** sirve para un manual.

**1. Modo conversacional (Playwright MCP).** Conectas el servidor MCP de Playwright y le hablas a Copilot en lenguaje natural: «abre la home, rechaza el banner de cookies y hazme una captura». Copilot abre un navegador real, navega y te devuelve la imagen ahí mismo, en el chat. Es determinista y rápido, perfecto para **explorar** la app, descubrir selectores o sacar una captura puntual.

Su pega para un manual: las capturas se quedan en la conversación, no en disco de forma ordenada y repetible. Sirve para investigar, no para producir las 40 imágenes finales una y otra vez.

**2. Modo script (reproducible).** Copilot te escribe un script de Playwright —un `.spec.ts` normal y corriente— que recorre todas las pantallas, guarda cada captura con su nombre en una carpeta, y lo vuelves a lanzar cuando quieras. Esto sí es para el manual. El script se queda en el repo, lo versionas con Git, y es tu fuente de verdad.

**La jugada ganadora combina las dos:** usas el modo conversacional para que Copilot *descubra* cómo moverse por tu app (y de paso valide que los selectores funcionan en un navegador real), y luego le pides que convierta esa exploración en el script reproducible. Lo mejor de cada mundo.

---

## Montar el entorno (una vez)

### Lo que necesitas

- **Node.js** instalado (lo necesitas tanto para el MCP como para el `npx`). Si trabajas en .NET no lo tendrás por defecto — instálalo, es indoloro.
- **VS Code** con **GitHub Copilot** activo y **Agent mode** disponible. Sin agent mode, el MCP no pinta nada.
- Tu app web corriendo en algún sitio accesible: `localhost`, un entorno de staging, lo que sea.

### Conectar Playwright MCP a VS Code

Crea (o edita) el archivo `.vscode/mcp.json` en la raíz de tu proyecto. Ojo con un detalle que despista a mucha gente: **VS Code usa la clave `servers`**, no `mcpServers` como otros clientes MCP.

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Guarda, recarga VS Code, y abre el chat de Copilot en modo **Agent**. Para comprobar que funciona, pídele algo sencillo:

> Abre una sesión de navegador, navega a https://demo.playwright.dev/todomvc y hazme una captura.

Si se abre el navegador y te devuelve la imagen, ya está vivo. La primera vez VS Code te pedirá confirmar que confías en el servidor, y puede que te pida aprobar cada herramienta — normal.

> **Nota sobre el paquete:** el servidor oficial de Microsoft es `@playwright/mcp`. Trabaja sobre el árbol de accesibilidad de la página (roles, textos, referencias a elementos), no sobre píxeles. Eso lo hace deterministsa para *interactuar*, pero para el manual lo que te interesa es la captura de imagen, que también sabe hacer.

### El primo eficiente: Playwright CLI

Si notas que las sesiones del MCP se comen el contexto de Copilot a velocidad de vértigo, hay alternativa. Microsoft sacó `@playwright/cli`, que en vez de meter cada snapshot y captura en la ventana de contexto del modelo, **guarda los resultados en archivos en disco** y usa comandos de shell. Consume del orden de 4 veces menos tokens.

Para un manual esto encaja de maravilla, porque tú lo que quieres es justamente eso: ficheros en una carpeta. Funciona cuando el agente tiene acceso al sistema de archivos (Copilot lo tiene). Si vas a generar muchas capturas, tenlo en el radar.

### ¿Y si quieres quedarte en .NET?

Puedes. Playwright tiene binding oficial para .NET (`Microsoft.Playwright`), así que el script reproducible lo puedes escribir en C# si prefieres no salir de tu stack. El servidor MCP sigue siendo Node por debajo, pero el script de capturas final no tiene por qué serlo. Dicho esto, para este caso concreto TypeScript/Node es el camino más trillado: más ejemplos, más fluidez de Copilot, menos fricción. Tú decides según el proyecto — no hay premio por forzar el stack.

---

## El flujo recomendado: capturas como código

Aquí está la chicha. El objetivo es un único script que, al ejecutarlo, deja el manual entero capturado y listo.

### Paso 1 — Instala Playwright como dependencia

```bash
npm init playwright@latest
# o, si ya tienes proyecto:
npm i -D @playwright/test && npx playwright install
```

### Paso 2 — Pídele el script a Copilot (en Agent mode)

Este es el prompt que le pasas. Cuanto más concreto, menos lo tienes que corregir después:

> Crea un script de Playwright (`manual-screenshots.spec.ts`) que recorra estas pantallas de mi app en `http://localhost:5173` y guarde una captura de cada una en `docs/manual/img/`:
> 1. Login (`/login`)
> 2. Dashboard (`/`) tras iniciar sesión con usuario `demo`
> 3. Listado de pacientes (`/pacientes`)
> 4. Detalle de paciente (`/pacientes/1`)
>
> Requisitos: viewport 1440×900, `deviceScaleFactor: 2` para que se vean nítidas, espera a que la red esté inactiva antes de capturar, desactiva animaciones, y nombra los ficheros `01-login.png`, `02-dashboard.png`, etc.

Copilot te devuelve algo parecido a esto (y si conectaste el MCP, habrá podido verificar los selectores en un navegador real antes de escribirlo):

```typescript
import { test } from '@playwright/test';

const BASE = 'http://localhost:5173';
const OUT = 'docs/manual/img';

// Configuración común para que TODAS las capturas salgan iguales
test.use({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,        // capturas nítidas en pantallas HiDPI/retina
  colorScheme: 'light',        // tema consistente; pon 'dark' para la variante oscura
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
});

const opciones = {
  fullPage: true,
  animations: 'disabled' as const, // congela transiciones y spinners
};

test('capturas del manual', async ({ page }) => {
  // 1. Login
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/01-login.png`, ...opciones });

  // 2. Dashboard (autenticado)
  await page.getByLabel('Usuario').fill('demo');
  await page.getByLabel('Contraseña').fill('demo');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL(`${BASE}/`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/02-dashboard.png`, ...opciones });

  // 3. Listado de pacientes
  await page.goto(`${BASE}/pacientes`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/03-pacientes.png`, ...opciones });

  // 4. Detalle de paciente
  await page.goto(`${BASE}/pacientes/1`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${OUT}/04-detalle-paciente.png`, ...opciones });
});
```

### Paso 3 — Lánzalo

```bash
npx playwright test manual-screenshots.spec.ts
```

Y ya tienes la carpeta `docs/manual/img/` poblada. ¿Mañana cambia el dashboard? Vuelves a lanzar el comando y las capturas se actualizan solas. Eso es lo que estabas buscando.

---

## Buenas prácticas que separan un manual decente de uno cutre

He visto manuales con capturas borrosas, con datos de un cliente real a la vista, y con un tooltip a medio abrir porque alguien no esperó a que cargara. Todo eso se evita con cuatro detalles.

### Nitidez: `deviceScaleFactor: 2`

Sin esto, las capturas se ven blandas en cuanto el lector abre el PDF en una pantalla decente. Con factor 2 estás generando a doble densidad — el texto de la UI sale crujiente. Es el ajuste que más se nota y el que más gente olvida.

### Consistencia: misma resolución, mismo tema, siempre

Si cada captura sale con un ancho distinto, el manual parece un collage. Fija el `viewport`, el `colorScheme` y el `locale` una sola vez (como en el `test.use` de arriba) y olvídate. Bonus: si tu app tiene modo claro y oscuro, duplica el script con `colorScheme: 'dark'` y tienes las dos versiones del manual sin esfuerzo extra.

### Datos reproducibles (y nada de datos reales)

Esto es importante y tiene dos caras.

Por un lado, **determinismo**: si el dashboard muestra «últimos 7 días» con datos que cambian, cada captura saldrá distinta. Mockea las respuestas de la API con `page.route()` para que siempre se vea lo mismo, o usa un usuario de demo con datos sembrados fijos.

Por otro lado, **RGPD**: ni se te ocurra capturar la pantalla con el nombre, DNI o historial de un paciente o cliente real. Para una clínica dental, por ejemplo, eso es un problema serio, no un descuido estético. Dos defensas:

- Trabaja siempre sobre datos de demo ficticios (María García, paciente 1, etc.).
- Si aun así aparece algo sensible en algún recuadro, usa la opción `mask` de Playwright para taparlo con una caja en la propia captura:

```typescript
await page.screenshot({
  path: `${OUT}/03-pacientes.png`,
  mask: [page.locator('.columna-dni'), page.locator('.email-paciente')],
  ...opciones,
});
```

### Espera bien antes de disparar

El error clásico: capturar mientras la página todavía está cargando. `waitForLoadState('networkidle')` cubre la mayoría de casos, pero si tienes un spinner o una animación de entrada, añade una espera al elemento ya estable —`await page.getByRole('table').waitFor()`— antes de la captura. Y `animations: 'disabled'` evita que pilles un fade a medias.

### Captura el elemento, no toda la página, cuando convenga

Para el manual a veces no quieres la pantalla entera, sino solo el formulario o el panel concreto que estás explicando. En vez de `page.screenshot`, captura sobre el locator:

```typescript
await page.getByRole('form', { name: 'Nueva cita' })
          .screenshot({ path: `${OUT}/05-form-cita.png` });
```

Capturas más limpias, más centradas en lo que cuentas, y sin tener que recortar a mano después.

---

## Prompts útiles para Copilot

Tres que vas a usar a menudo, listos para pegar en el chat (Agent mode):

**Para descubrir selectores cuando no los conoces** (modo conversacional, con el MCP):
> Navega a `http://localhost:5173/pacientes`, dime qué selector estable usarías para el botón de "Nueva cita" y haz una captura para que la vea.

**Para añadir una pantalla nueva al script existente:**
> Añade al script `manual-screenshots.spec.ts` una captura de la pantalla de facturación (`/facturas`), siguiendo exactamente el mismo patrón, viewport y naming que las demás. Numérala como `06-`.

**Para generar la variante en modo oscuro:**
> Duplica el script en `manual-screenshots-dark.spec.ts` cambiando `colorScheme` a `'dark'` y guardando las capturas en `docs/manual/img/dark/`.

---

## Cerrar el círculo: meterlo en tu flujo

Las capturas viven en `docs/manual/img/`, así que enlazarlas desde el manual en Markdown es directo:

```markdown
## Pantalla de inicio de sesión

![Pantalla de login](img/01-login.png)

Introduce tu usuario y contraseña...
```

Si el manual lo escribes en Obsidian, esa misma carpeta de imágenes la referencias igual y las ves renderizadas en el editor.

¿Quieres ir un paso más allá? Mete el script en tu CI para que, en cada cambio de la UI, regenere las capturas (o al menos te avise de que han cambiado comparándolas con las anteriores — Playwright tiene comparación visual integrada con `toHaveScreenshot`). Así el manual nunca se queda atrás sin que nadie se entere.

---

Empieza por lo pequeño: conecta el MCP, dile a Copilot que capture **una** pantalla y comprueba que el navegador se abre. Cuando veas esa primera imagen aparecer en el chat, pídele el script para las otras tres. En media tarde tienes el manual entero como código — y la próxima vez que rediseñes el dashboard, lo único que harás será pulsar Enter.