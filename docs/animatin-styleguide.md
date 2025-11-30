 Animation Constitution Context

**this document cnotains the constitution must animation design system, very UI Element created in this project  must follow the next principles.

Intro + Animation on Scroll:
"Animate when in view: fade in, slide in, blur in, element by element. Use 'both' instead of 'forwards'. Don't use opacity 0. Add a clip animation to the background, column by column using clip-path."

Buttons:
"Add a 1px border beam animation around the pill-shaped button on hover."

Text Animation:
"Add a vertical text clip slide down animation letter by letter."

Logos Looping:
"Add a marquis infinite loop slow animation to the logos using alpha mask."

Content Switching:
"Animate the big card to rotate between 3 cards in a loop. Add prev/next arrows to switch between cards."

Flashlight on Hover:
"Add a subtle flashlight effect on hover/mouse position to both background and border of the cards."

 
 
 
 
 
 
 
 
 
 { "adaptive_layout_specs": {
    "mobile": {
      "stacking": "single column",
      "images": { "large": { "scale": 0.85, "translateY": 10 }, "small": { "scale": 0.8 } }
    },
    "tablet": { "stacking": "two columns", "heroContentWidth": "72%" },
    "desktop": { "stacking": "two columns", "heroContentWidth": "65%" }
  },
  "animations": {
    "global": { "defaultEasing": "cubic-bezier(.22,.9,.26,1)", "durationBase": 600 },
    "definitions": {
      "fadeInUp": {
        "keyframes": "@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(18px); } 60% { opacity: 1; transform: translateY(-6px); } 100% { transform: translateY(0); } }",
        "default": { "duration": 680, "easing": "cubic-bezier(.22,.9,.26,1)", "fillMode": "forwards" },
        "usage": "entrance for text blocks and small icons; ideal for staggered lists"
      },
      "floatSlow": {
        "keyframes": "@keyframes floatSlow { 0%{ transform: translateY(0) rotate(-1deg) } 50%{ transform: translateY(-10px) rotate(1deg) } 100%{ transform: translateY(0) rotate(-1deg)}}",
        "default": { "duration": 8000, "easing": "ease-in-out", "iteration": "infinite", "direction": "alternate" },
        "usage": "gentle floating for decorative shapes and large hero images"
      },
      "jiggleMicro": {
        "keyframes": "@keyframes jiggleMicro { 0%{ transform: translateX(0) } 25%{ transform: translateX(2px) } 50%{ transform: translateX(-2px) } 75%{ transform: translateX(1px) } 100%{ transform: translateX(0) } }",
        "default": { "duration": 550, "easing": "ease", "iteration": "infinite", "direction": "alternate" },
        "usage": "call-to-action micro attention on hover"
      },
      "parallaxTilt": {
        "keyframes": "@keyframes parallaxTilt { 0%{ transform: translateZ(0) rotateY(0) } 100%{ transform: translateZ(10px) rotateY(6deg) }}",
        "default": { "duration": 1000, "easing": "cubic-bezier(.2,.8,.2,1)", "fillMode": "forwards" },
        "usage": "3D tilt on hover or mouse-move for hero imagery"
      },
      "revealClip": {
        "keyframes": "@keyframes revealClip { 0%{ clip-path: inset(0 100% 0 0); opacity:0 } 60%{ clip-path: inset(0 10% 0 0); opacity:1 } 100%{ clip-path: inset(0 0 0 0); opacity:1 }}",
        "default": { "duration": 780, "easing": "cubic-bezier(.22,.9,.26,1)" },
        "usage": "image reveal / masked entrance"
      }
    },
    "imagesAnimations": {
      "heroMainLarge": {
        "target": ".hero__image--main",
        "type": "combined",
        "keyframesUsed": ["floatSlow","parallaxTilt","revealClip"],
        "timing": { "initialDelay": 120, "fadeIn": 520, "floatDuration": 8500, "tiltOnHoverDuration": 300 },
        "properties": {
          "motion": "very slow vertical oscillation (-10px -> 0 -> -10px)",
          "rotation": "micro rotation +/- 2 deg steady",
          "scale": "1.00 -> 1.03 on hover",
          "depth": "subtle translateZ effect to suggest depth",
          "mask": "soft reveal from right to left using clip-path",
          "shadow": "dynamic larger soft glow under the base that scales with hover"
        },
        "description_ES": "Imagen principal grande en el hero: aparece mediante un 'reveal' con clip-path desde la derecha, tras la entrada inicia un flotado lento (oscila verticalmente ~10px) combinado con micro-rotaciones (±2°) para dar vida. Al mover el puntero, aplicará un tilt 3D suave (rotateY 4–8°) y un ligero escalado a 1.02–1.04. Sombra base aumenta y se hace más difusa en hover para aumentar sensación de profundidad. La animación de flotado es continua e infinita; el reveal solo en entrada."
      },
      "heroAccentLarge": {
        "target": ".hero__image--accent",
        "type": "parallax-stagger",
        "keyframesUsed": ["floatSlow","revealClip"],
        "timing": { "stagger": 140, "floatDuration": 7200, "initialDelay": 320 },
        "properties": {
          "motion": "diagonal float (x & y subtle offsets) with slight rotation",
          "opacity": "0 -> 1 during reveal",
          "blurFallback": "on low-power devices apply small blur instead of transform"
        },
        "description_ES": "Imagen acento grande: entra después de la principal con retardo escalonado y realiza un desplazamiento diagonal muy sutil mientras rota levemente. Opacidad sube durante reveal. Ajustes para dispositivos de poco rendimiento: en vez de transformaciones prolongadas aplica un blur y fade."
      },
      "decorativeSmallCluster": {
        "target": ".hero__decorative img",
        "type": "stagger-loop",
        "keyframesUsed": ["floatSlow","jiggleMicro"],
        "timing": { "staggerBase": 120, "durationsRange": [3600, 9000], "iteration": "infinite" },
        "properties": {
          "movement": "cada elemento tiene su patrón: algunos hacen loops verticales, otros horizontales, algunos micro rotates",
          "opacityPulse": "pequeños pulsos de 0.9->1",
          "scale": "0.98->1.02 alternado"
        },
        "description_ES": "Grupo de imágenes pequeñas decorativas: animación por niveles (stagger): cada imagen tiene su propio ritmo y amplitud para evitar sensación repetitiva. Algunas suben-bajan lentamente; otras hacen micro-jigs (movimientos laterales cortos). Frecuencias y fases se solapan para una sensación orgánica. En hover de cada pequeña, se pausa su loop y se aplica un leve zoom-in y sombra."
      },
      "cardGridImages": {
        "target": ".card .thumb",
        "type": "hover-reveal + micro-float",
        "keyframesUsed": ["fadeInUp","jiggleMicro"],
        "timing": { "hoverTransition": 220, "entranceStagger": 90 },
        "properties": {
          "entrance": "cards aparecen con fadeInUp y stagger",
          "hover": "al pasar se escala 1.03 y ligera rotación -1° a 1°",
          "focus": "a11y: focus dispara mismo efecto que hover"
        },
        "description_ES": "Imágenes de tarjetas: entrada con fade-in + subida corta. Al 'hover' o 'focus' escala ligeramente y rota microgrados para dar sensación interactiva. Pequeños rebotes al regresar. Animación diseñada para accesibilidad (también funciona por teclado)."
      },
      "floatingBadgeSmall": {
        "target": ".badge--floating",
        "type": "pulseAndFloat",
        "keyframesUsed": ["floatSlow"],
        "timing": { "duration": 4200, "delay": 240, "iteration": "infinite" },
        "properties": {
          "scalePulse": "pulsación sutil 0.98 -> 1.03",
          "glow": "micro glow changes to accent color on hover",
          "pointerInteraction": "on hover pointer-events set to auto and enlarge"
        },
        "description_ES": "Pequeños badges flotantes que pulsan y se desplazan verticalmente. Diseñados para micro interacciones visibles; al pasar el ratón se luce el resplandor y aumenta su escala."
      }
    }
  },
  "animation_script_snippets": {
    "intersectionObserver": {
      "purpose": "Iniciar reveal y staggered loops cuando el elemento entra en el viewport",
      "example": "const io = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('is-visible'); }) }, { threshold: 0.12 }); document.querySelectorAll('.reveal').forEach(n => io.observe(n));"
    },
    "parallaxOnMouseMove": {
      "purpose": "Mapear movimiento del ratón para tilt 3D y parallax de capas",
      "example": "container.addEventListener('pointermove', e => { const x=(e.clientX/containerWidth-.5)*20; const y=(e.clientY/containerHeight-.5)*10; mainImage.style.transform=`rotateY(${x}deg) rotateX(${y}deg) translateZ(6px)`; });"
    }
  },
  "performanceAccessibility": {
    "prefersReducedMotion": "Si prefers-reduced-motion = reduce, usar sólo reveals simples (opacity + translate) y desactivar loops infinitos",
    "lowPowerMode": "en dispositivos baja potencia reducir duration, no animar transforms pesadas, usar blur/fade",
    "a11y": "todas las animaciones deben poder pausarse con prefers-reduced-motion; contraste de texto con fondo mínimo WCAG 4.5:1"
  }
}