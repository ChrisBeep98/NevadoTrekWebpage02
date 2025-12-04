# Documentación del Header - Nevado Trek

## Resumen Rápido

| Estado | Clase CSS | Ubicación |
|--------|-----------|-----------|
| **Arriba (Hero/Fondo Oscuro)** | `navbar-dark-mode` | Texto BLANCO |
| **Abajo (Fondo Claro)** | `navbar-light-mode` | Texto OSCURO |
| **Header Contraído** | ⚠️ NO IMPLEMENTADO | Ver nota abajo |

> [!WARNING]
> Actualmente **NO existe** una animación de "contracción" del header al hacer scroll. Solo cambia el color del texto. Si quieres añadir esa funcionalidad, necesitaremos crearla.

---

## Estructura HTML

**Archivo:** [index.html](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/index.html#L118-L185)

```html
<nav id="navbar-exclusion" class="navbar-fixed">
  <div class="navbar-container">
    <!-- Logo y Nombre -->
    <a href="/" class="navbar-brand">
      <img src="..." class="navbar-logo" />
      <p class="navbar-title">Nevado Trek</p>
    </a>
    
    <!-- Links de Navegación -->
    <div class="navbar-links">
      <a class="nav-link-exclusion">Inicio</a>
      <a class="nav-link-exclusion">Tours</a>
      <a class="nav-link-exclusion">Galería</a>
    </div>
    
    <!-- Acciones (idioma, contacto, menú) -->
    <div class="navbar-actions">
      <div class="lang-switch-exclusion">...</div>
      <a class="btn-contact-exclusion">Contacto</a>
      <button class="menu-toggle-exclusion">☰</button>
    </div>
  </div>
</nav>
```

---

## Estilos CSS

**Archivo:** [index-animations.css](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/css/index-animations.css#L74-L150)

### Estado Base (Siempre Fijo)
```css
#navbar-exclusion {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  background: transparent;
  padding: 1em 0;
}
```

### Modo Oscuro (Texto Blanco) - Para fondos oscuros como el Hero
```css
#navbar-exclusion.navbar-dark-mode .navbar-brand,
#navbar-exclusion.navbar-dark-mode .navbar-title,
#navbar-exclusion.navbar-dark-mode .nav-link-exclusion {
  color: #ffffff !important;
}

#navbar-exclusion.navbar-dark-mode .navbar-logo {
  filter: brightness(0) invert(1) !important; /* Logo blanco */
}
```

### Modo Claro (Texto Oscuro) - Para fondos blancos
```css
#navbar-exclusion.navbar-light-mode .navbar-brand,
#navbar-exclusion.navbar-light-mode .navbar-title,
#navbar-exclusion.navbar-light-mode .nav-link-exclusion {
  color: #042e4d !important; /* Azul oscuro */
}

#navbar-exclusion.navbar-light-mode .navbar-logo {
  filter: none !important; /* Logo original */
}
```

---

## Script de Cambio de Color

**Archivo:** [index.html](file:///d:/Nevado%20Trek%20Development/NevadoTrekWeb01/index.html#L4395-L4520)

```javascript
// Detecta qué elemento está debajo del navbar
function checkNavbarBackground() {
  var x = window.innerWidth / 2;
  var y = navbar.offsetHeight / 2;
  
  navbar.style.visibility = "hidden";
  var elementBelow = document.elementFromPoint(x, y);
  navbar.style.visibility = "visible";
  
  // Si el elemento tiene clase "is--hero" o fondo oscuro
  if (isDark) {
    navbar.classList.add("navbar-dark-mode");    // Texto blanco
    navbar.classList.remove("navbar-light-mode");
  } else {
    navbar.classList.add("navbar-light-mode");   // Texto oscuro
    navbar.classList.remove("navbar-dark-mode");
  }
}

// Se ejecuta en cada scroll
window.addEventListener("scroll", checkNavbarBackground);
```

---

## ¿Qué Quieres Hacer?

1. **Cambiar los colores** → Edita `index-animations.css` líneas 117-150
2. **Cambiar el tamaño/padding** → Edita `index-animations.css` línea 74-85
3. **Añadir efecto de contracción al scroll** → ⚠️ Necesitamos crear nuevo código
4. **Cambiar la lógica de detección** → Edita el script en `index.html` líneas 4395-4520

---

## Próximo Paso Sugerido

Si quieres que el header **se contraiga** (se haga más pequeño) al hacer scroll, dime y lo implemento. Sería algo como:

- **Arriba (scroll = 0):** Header grande con padding de 1.5em
- **Al bajar (scroll > 50px):** Header pequeño con padding de 0.5em y fondo semi-transparente
