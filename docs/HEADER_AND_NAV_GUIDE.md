# 🧭 Guía de Header y Navegación (NTM)

Este documento explica el funcionamiento técnico del sistema de navegación de **Nevado Trek** y cómo realizar cambios sin comprometer la integridad del diseño o las animaciones.

---

## 🏗️ Arquitectura de Componentes

Para garantizar la consistencia en todo el sitio, el menú móvil está **componentizado**. Esto significa que solo existe un archivo maestro para el HTML.

1.  **HTML Maestro:** [mobile-menu.html](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/components/mobile-menu.html)
2.  **Cargador Dinámico:** [load-components.js](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/js/load-components.js)
3.  **Estilos:** [new-mobile-menu.css](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/css/new-mobile-menu.css)
4.  **Lógica y Animaciones:** [new-mobile-menu.js](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/js/new-mobile-menu.js)

### Cómo se inyecta en las páginas
Cada página (`index.html`, `TourPage.html`, etc.) tiene un marcador de posición (placeholder):
```html
<div id="ntm-menu" class="ntm-menu-overlay"></div>
```
El script `load-components.js` detecta este ID, descarga el componente y **normaliza las rutas** (corrige automáticamente si el link debe ser `./` o `../` dependiendo de la carpeta).

---

## ✨ Sistema de Animaciones (GSAP)

El menú utiliza **GSAP** para lograr un acabado "Premium". La secuencia de apertura es jerárquica:

1.  **Expansión Circular:** Crea un efecto de lente desde la esquina superior derecha.
2.  **Revelado Jerárquico:**
    *   `ntm-menu-title`: Aparece primero con un desplazamiento sutil.
    *   `ntm-nav-link`: Entran en cascada (stagger).
    *   `ntm-separator`: Se dibujan dinámicamente aumentando su ancho de 0 a 100%.
    *   `ntm-cta`: Entra al final con un rebote elástico (`elastic.out`).

---

## 🛠️ Cómo modificar sin dañar

### 1. Cambiar un link o un texto
**Archivo:** `components/mobile-menu.html`
*   **REGLA DE ORO:** Siempre usa rutas relativas a la raíz (ej: `Sections/Gallery.html`). El cargador se encargará de ajustarlas para las subcarpetas automáticamente.
*   No cambies las clases `ntm-nav-link` o `ntm-cta` ya que el JS las usa para las animaciones.

### 2. Cambiar colores o tamaños
**Archivo:** `css/new-mobile-menu.css`
*   Los enlaces tienen un **Hitbox de ancho completo**. Si cambias el `padding`, asegúrate de que siga siendo cómodo para dedos grandes en móvil.
*   El menú no tiene `border-radius` por diseño. Si lo añades, asegúrate de añadirlo con `!important` para sobrescribir los reseteos de seguridad.

### 3. Ajustar la "sensación" (On-Tap)
**Archivo:** `js/new-mobile-menu.js`
*   El efecto de pulsación (scale down + snap back) se maneja en la sección `PREMIUM TAP INTERACTION`.
*   Si cambias la duración de la apertura, ajusta también el `delay` del `setTimeout` en el evento `click` para que el usuario alcance a ver la pulsación antes de que el menú se cierre.

---

## ⚠️ Advertencias Críticas

> [!IMPORTANT]
> **No elimines los IDs:** El código depende de `#ntm-menu`, `#ntm-close` y `#ntm-menu-exclusion`. Si los cambias, el menú dejará de abrirse.

> [!TIP]
> **Orden de Scripts:** `load-components.js` siempre debe cargar **antes** que `new-mobile-menu.js`. El primero crea el HTML y el segundo le da vida.

> [!CAUTION]
> **Hitboxes:** Los links ocupan el 100% del ancho. Si añades márgenes laterales al contenedor `.ntm-nav`, asegúrate de que el link siga siendo clickable en toda la fila para no frustrar al usuario.
