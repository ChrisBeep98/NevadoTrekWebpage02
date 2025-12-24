# 🧭 Guía Maestra de Header y Navegación (NTM)

Este documento centraliza el funcionamiento técnico del nuevo sistema de navegación unificado de **Nevado Trek**.

---

## 🏗️ Arquitectura General

El sistema se divide en tres pilares:
1.  **Header Principal (`#navbar-exclusion`)**: Maneja el layout fijo y el efecto "Pill" al hacer scroll.
2.  **Menú Móvil (`ntm-`)**: Componente dinámico con animaciones premium.
3.  **Selector de Idioma**: Lógica centralizada para i18n.

### Archivos Clave
- **Estilos:** `css/index-animations.css` (Index) y `css/shared-navbar.css` (Global).
- **Lógica Navbar:** `js/navbar-handler.js`.
- **Lógica Menú:** `js/new-mobile-menu.js`.

---

## 💊 El efecto "Pill" (Scrolled State)

Al hacer scroll (> 50px), el header se transforma de una barra transparente a una **píldora flotante** con glassmorphism.

### Comportamiento de Color
- **Estado Inicial (Top):** El texto es blanco por defecto (`color: white`) para destacar sobre el hero.
- **Estado Scrolled (`.scrolled`):**
  - El contenedor se encoge y centra.
  - El fondo se vuelve translúcido (`rgba(255, 255, 255, 0.6)`).
  - **Crítico (Index):** El texto "Nevado Trek" y los links cambian a azul oscuro (`#042e4d`) para legibilidad.

---

## 📱 Refinamientos Móviles (Index)

Para una estética más limpia en móviles, se han aplicado reglas específicas:

1.  **Ocultación de la "Burbuja"**: El botón circular de contacto (`.header-contact-btn`) se oculta automáticamente en resoluciones menores a **991px**.
2.  **Ajuste de Títulos**: En móviles, el texto "Nevado Trek" reduce su tamaño y ajusta su color dinámicamente según el estado del scroll (blanco arriba, azul oscuro en la pastilla).

---

## ☰ Menú Móvil Premium (White Theme)

El menú móvil es un **componente inyectado** para asegurar consistencia en todo el sitio.

### Características Técnicas
- **Animación:** Expansión circular desde el botón hamburguesa utilizando GSAP.
- **Layout:** Ancho completo, altura de `80svh` (White Theme).
- **Carga:** Se inyecta mediante `js/load-components.js` buscando el div `#ntm-menu`.

### Cómo Editar Enlaces
Modifica únicamente el archivo master: `components/mobile-menu.html`. Las rutas se normalizan automáticamente para subcarpetas (Tours/Gallery).

---

## 🔧 Mantenimiento y Reglas de Oro

> [!IMPORTANT]
> **Orden de Scripts:**
> 1. `js/api-client.js`
> 2. `js/i18n.js`
> 3. `js/navbar-handler.js` (Inicializa el sistema)
> 4. `js/load-components.js` (Inyecta el menú)

> [!WARNING]
> **Clases de Estado:** No elimines la clase `.scrolled` del JS, ya que el CSS depende de ella para el 90% de los efectos visuales del header.

> [!TIP]
> **Colores:** El azul principal utilizado para el texto en estado "Pill" es `#042e4d`. Si cambias el fondo de la pastilla, asegúrate de verificar el contraste.
