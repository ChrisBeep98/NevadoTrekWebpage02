# Spec: Auditoría de Rendimiento y Resolución de Lag en la Página de Tours

## Background
La página de Tours (`ToursPage.html`) presenta un lag notable (micro-stuttering) durante el scroll, especialmente cuando el filtro está en "Todos" (aprox. 8 o más tarjetas visibles) y se aproxima al footer. Este comportamiento desaparece cuando hay pocos elementos visibles (por ejemplo, con el filtro "Difícil").

## Objectives
- Identificar la causa raíz del lag: ¿Es el número de animaciones activas, el sistema de filtrado, o la animación del footer?
- Optimizar la inicialización de animaciones en las tarjetas de tours.
- Asegurar que la animación de "revelado de cortina" del footer sea fluida y no interfiera con otros elementos.
- Garantizar un rendimiento de 60fps constantes.

## Scope
- `Sections/ToursPage.html`
- `js/tours-page-loader.js`
- `js/tour-animations.js`
- `js/tours-page-footer-reveal.js`
- `css/tours-page.css`
- `css/tour-animations.css`

## Success Criteria
- Scroll fluido sin saltos visuales con todas las tarjetas visibles.
- La animación del footer se activa sin causar caídas de frames.
- El sistema de filtrado no deja rastro de animaciones "huérfanas" o triggers pesados en memoria.
