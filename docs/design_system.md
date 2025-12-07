# Nevado Trek - Design System & Styling Constitution

Este documento es la fuente de verdad para el diseño del sitio web. Contiene todos los tokens de diseño, clases utilitarias y reglas extraídas del CSS de producción.

**Ubicación de Archivos:**
*   CSS Principal: `/css/nevado-trek-*.css`
*   Animaciones: `/css/index-animations.css`, `/css/tour-animations.css`

---

## 1. Paleta de Colores (Color System)

### Variables CSS Principales (:root)
Usa estas variables siempre que sea posible.

| Variable | Hex / Valor | Nombre Semántico | Uso Principal |
|---|---|---|---|
| `--color--dark` | `#042e4d` | **Dark Navy** | Fondos oscuros, Texto principal, Navbar Brand |
| `--color--blue-dark` | `#8fbbd3` | **Soft Blue** | Acentos, bordes focus, iconos secundarios |
| `--color--blue-medium`| `#dde9f0` | **Pale Blue** | Fondos de sección "Ligeros", inputs background |
| `--color--blue-light` | `#edf6f3` | **Ice Blue** | Fondos alternativos muy claros |
| `--pink` | `#ed155c` | **Highlight Pink** | Chips de fecha, notificaciones, alertas |
| `--color--light` | `white` | **White** | Texto sobre fondo oscuro, tarjetas |
| `--color--light-off` | `#f7f7f3` | **Off-White** | Variación sutil de blanco |
| `--font-grey-100` | `#687075` | **Grey 100** | Texto secundario / Meta info |

### Colores Utilitarios (Hardcoded en Clases)
Colores que aparecen en botones o utilidades específicas.

*   **Brand Blue Action:** `#0070e0` (Usado en `.button-6`, `.button-4` hover)
*   **Green Success:** `#25993f` (Usado en `.button-*.c-green`)
*   **Red Danger:** `#d93644` (Usado en `.button-*.c-red`)
*   **Yellow Warning:** `#ffeb33` (Usado en `.button-*.c-yellow`)

---

## 2. Tipografía (Typography)

### Fuentes
1.  **Display:** `Tasa Orbiter Display` (Headers decorativos)
2.  **UI/Body:** `Inter` (Google Font) - *Principal para lectura*
3.  **Fallback:** `Arial, sans-serif`

### Clases de Encabezado (Utility Classes)
Estas clases desacoplan el estilo visual de la jerarquía semántica (h1-h6).

| Clase | Tamaño | Peso | Line-Height | Uso Detectado |
|---|---|---|---|---|
| `.style-h0` | `13.8em` | 600 | 0.8 | Títulos gigantes (Hero Backgrounds) |
| `.style-h1` | `6.1em` | 400 | 1.2 | Títulos de Sección (Uppercase) |
| `.h-2` | `7vw` | 600 | 7.4vw | Títulos principales responsivos |
| `.h-3` | `24px` | 700 | 30px | Títulos de tarjetas / secciones menores |
| `.h-4` | *Inherit* | 600 | 50px | Subtítulos intermedios |
| `.h-5` | `20px` | 300 | 35px | Títulos de tarjetas pequeñas, destacados |
| `.h-6` | `16px` | 600 | 20px | Etiquetas pequeñas, kickers |

### Cuerpo de Texto

| Clase | Tamaño | Peso | Line-Height | Tracking | Notas |
|---|---|---|---|---|---|
| `.body-large` | `18px` | 300 | 1.6 | 1px | Intros, párrafos destacados |
| `.body-medium`| `16px` | 300 | 1.4 | 0.8px | **Estándar** para párrafos |
| `.body-small` | `13px` | 300 | - | 0.6px | Meta info, fechas, chips |
| `p` (base) | `14px` | - | - | - | Fallback global |

---

## 3. Botones y Componentes (Components)

### Botones (`.button-*`)
El sistema usa variaciones numeradas. La principal detectada es `.button-6`.

*   **Estilo Base (`.button-6`):**
    *   Fondo: `#0070e0` (Brand Blue) -> Hover: `#0461be`
    *   Texto: Blanco
    *   Radius: `.3em` (~5px)
    *   Padding: `0 1.3em`
    *   Sombra interna sutil: `inset 0 -1px #00000021`
*   **Variantes de Color:** `.c-green`, `.c-red`, `.c-grey`, `.c-white`.
*   **Variantes de Tamaño:** `.small` (Height: 52px, Radius: 8px).

### Chips (`.pink-chip` / `.chip-tour-info-wrapper`)
*   Usados para fechas y metadatos en tarjetas.
*   Suelen tener `backdrop-filter: blur(5px)` y bordes semitransparentes.

---

## 4. Espaciado y Layout (Spacing & Layout)

### Variables de Espaciado Global
*   `--base--section-padding`: `5em` (Default Padding Sección Desktop)
*   `--base--section-padding-large`: `8em` (Secciones con mucho aire)
*   `--base--section-padding-small`: `2.5em` (Secciones compactas)

### Regla de Oro Responsive (Tablet/Mobile)
En pantallas `< 992px`, se aplica una regla estricta de márgenes laterales:

> **Margen Lateral: 16px**
> Todo el contenido de texto y contenedores debe tener un padding lateral de 16px.

*   **Contenedores de Contenido:** (`.a-grid`, `.div-block-130`, `.container`) -> `padding-left: 16px; padding-right: 16px;`
*   **Wrappers Principales:** (`.section-8`) -> `padding: 0;` (Para permitir elementos full-width edge-to-edge).

### Espaciado Hero (TourPage)
Elementos dentro del bloque hero (`.div-block-130`):
*   **Gap:** `12px` (Flex gap entre elementos)
*   **Márgenes Texto:** `6px` bottom (`.h-1`, `.tour-subtitle`)
*   **Chips:** `6px` top

---

## 5. Utilidades Visuales (Utility Classes)

*   **Texto:** `.text-center`, `.align-center`, `.italic`
*   **Color Texto:** `.f-white`, `.f-blue-dark`, `.f-grey`, `.f-pink`
*   **Sombras:** `.text-shadow-1` (Sombra suave para texto sobre imagen)
*   **Fondos:** `.bg-dark` (`--color--dark`), `.bg-blur` (backdrop blur)

---

## 6. Comportamiento Responsivo (Responsive Behavior)

Este proyecto sigue una estrategia **Desktop-First** con adaptaciones específicas para mantener la calidad visual en móviles.

### Breakpoints
1.  **Tablet:** `< 992px` (Cambio estructural mayor: Grid -> Columnas)
2.  **Mobile Landscape:** `< 768px` (Ajustes de tamaño de fuente)
3.  **Mobile Portrait:** `< 480px` (Layout final compacto)

### Transformaciones Clave (Tablet & Mobile)

#### 1. Layouts Grid -> Flex Column
Los contenedores `.a-grid` que en desktop son grids de varias columnas, se transforman automáticamente a:
```css
display: flex;
flex-direction: column;
gap: 2rem;
padding: 0 16px; /* Mantiene el margen de seguridad */
```

#### 2. Imágenes Full-Width (Edge-to-Edge)
Las imágenes principales (`.scroll-zoom-image`) rompen el grid para ocupar el 100% del ancho de la pantalla:
*   **Ancho:** `100vw` (Full width)
*   **Márgenes:** `0` (Sin margen lateral)
*   **Contenedor Padre:** El padre directo (`.section-8`) tiene `padding: 0` forzado.
*   **Animación Grow:** Desactivada visualmente (la imagen ya empieza al 100% de ancho).

#### 3. Navbar Responsivo
El header (`#navbar-exclusion`) tiene un comportamiento específico en tablet/mobile:
*   **Ancho:** `calc(100% - 32px)` (Para dejar 16px a cada lado)
*   **Posición:** Centrado con `left: 16px` y `right: 16px`.
*   **Hamburger:** Barras oscuras (`#042e4d`) forzadas mediante `stroke` en el SVG, anulando inversiones de color de otras páginas.
*   **Filtros:** `mix-blend-mode: normal` para evitar inversión de colores sobre fondos claros.

#### 4. Ajustes Específicos (Nodos w-node)
Ciertos elementos tienen ajustes manuales por ID en responsive:
*   `#w-node...582`: Altura foza a `400px` y `width: 100%`.
*   Contenedores específicos: `margin-top: 64px` para separar secciones visualmente.
*   `parallax-image-medium`: Reduce su `margin-top` de 160px a `64px`.

---

## Instrucciones para Nuevo Contenido
1.  **NO** uses valores pixelados arbitrarios (`margin-top: 17px`). Usa variables.
2.  Para textos nuevos, intenta usar `.body-medium` como base.
3.  Para botones nuevos, usa `.button-6` con las clases modificadoras existentes.
