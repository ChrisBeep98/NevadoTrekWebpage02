# Plan: Auditoría de Rendimiento y Resolución de Lag en la Página de Tours

## Phase 1: Diagnóstico y Auditoría
- [x] Task: Analizar la estructura de `ToursPage.html` y cómo se inyectan las tarjetas.
- [x] Task: Auditar `tours-page-loader.js` para verificar si las animaciones se reinicializan incorrectamente durante el filtrado.
- [x] Task: Revisar `tour-animations.js` buscando triggers pesados o redundantes en las tarjetas.
- [x] Task: Examinar `tours-page-footer-reveal.js` para detectar conflictos con el contenedor principal de scroll.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnóstico y Auditoría' (Protocol in workflow.md)

## Phase 2: Optimización de Tarjetas y Filtrado
- [x] Task: Implementar una gestión eficiente de `ScrollTrigger` (kill/refresh) al cambiar de filtros.
- [x] Task: Refactorizar la animación de las tarjetas para usar una sola instancia delegada o triggers más ligeros.
- [x] Task: Optimizar el CSS de las tarjetas (will-change, layer separation) para reducir el costo de pintura.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Optimización de Tarjetas y Filtrado' (Protocol in workflow.md)

## Phase 3: Estabilización del Footer y MVP
- [x] Task: Corregir la animación de "cortina" del footer para evitar saltos en el scroll final.
- [x] Task: Realizar una prueba de rendimiento final con 12+ tarjetas.
- [x] Task: Verificar que el sistema i18n no cause re-renders pesados que afecten el scroll.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Estabilización del Footer y MVP' (Protocol in workflow.md)