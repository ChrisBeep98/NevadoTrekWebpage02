# Product Guidelines: Nevado Trek Web

## Design Principles
- **Inmersión Total:** El usuario debe sentir la majestuosidad de Los Nevados a través de efectos de parallax, revelados y transiciones fluidas.
- **Rendimiento sobre Todo:** Ninguna animación debe comprometer la fluidez. El objetivo es mantener 60fps constantes.
- **Fidelidad Visual:** Mantener la estética "pixel-perfect" lograda en la maquetación inicial, pero optimizando la estructura subyacente.

## Technical Standards (Anti-Webflow Debt)
- **GSAP como Estándar:** Preferir GSAP para animaciones complejas de scroll y revelado, reemplazando gradualmente los triggers nativos de Webflow que causen lag.
- **Limpieza de CSS:** Respetar el Design System existente (variables de color, tipografía, botones), pero auditar las clases de Webflow para evitar conflictos de especificidad.
- **Optimización de Activos:** Uso estricto de lazy loading, formatos modernos y dimensiones correctas para evitar bloqueos en el renderizado.

## Communication Style
- **Tono:** Inspiracional y Profesional.
- **Contenido:** Textos que inviten a la exploración pero que transmitan la seguridad de guías certificados.
- **Multi-idioma:** Todo nuevo contenido debe integrarse perfectamente en el sistema i18n existente (ES/EN).
