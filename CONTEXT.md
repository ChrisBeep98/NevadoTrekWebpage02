# Internationalization Context (ES/EN)

## Summary
- Added a minimal language switcher <select id="lang-switch"> (ES/EN) in header
- Standardized user-facing copy to Spanish/English via a small inline i18n script
- Attached data-i18n-key to selected elements; other texts updated via targeted selectors and replacements
- Language preference persisted in localStorage key: "lang"

## How the switch works
- On load, script reads localStorage.lang (default: "es") and applies translations
- Changing the selector updates localStorage and reapplies

## Keys and default texts
- nav.home: Inicio | Home
- nav.tours: Tours | Tours
- nav.gallery: Galería | Gallery
- cta.contact: Contácto | Contact
- hero.title: Un Paraíso En Salento | A Paradise In Salento
- hero.tag: Tu aventura, diseñada para dejar recuerdos inolvidables | Your adventure, designed to leave unforgettable memories
- section.experiences: ( Experiencias ) | ( Experiences )
- section.upcoming: ( Próximas Salidas) | ( Upcoming Departures )
- section.services: ( Servicios ) | ( Services )
- section.comments: ( Comentarios ) | ( Comments )
- section.faq: ( Preguntas Frecuentes ) | ( Frequently Asked Questions )
- btn.viewTours: Ver Tours | View Tours
- btn.viewOnGoogle: Ver en Google | View on Google
- cta.contactus: Contáctanos | Contact us
- misc.rnt: RNT: 05645453 | RNT: 05645453
- intro.t1: como el Sentido de la VidaViajar | as the Meaning of LifeTravel
- intro.t2: Conócete a ti mismo a través del viaje | Know yourself through travel
- about.title: ( Nosotros ) | ( About )
- services.lead: Traemos nuevas emociones... planificación. | We bring new emotions... planning.
- service.tag1: + 150 Expediciones Exitosas | + 150 Successful Expeditions
- service.tag2: Guías certificados | Certified guides
- service.tag3: Equipos de alta calidad | High‑quality gear
- service.h1: Seguridad primero | Safety first
- service.p1: Nuestros guías están certificados... | Our guides are certified...
- service2.tag1: Conocimiento cultural | Cultural knowledge
- service2.tag2: Experiencia en montaña | Mountain experience
- service2.tag3: Atención cercana | Close attention
- service2.h1: Guías locales expertos | Local expert guides
- service2.p1: Más que acompañantes... | More than companions...
- service3.tag1: Turismo responsable | Responsible tourism
- service3.tag2: Conexión con la naturaleza | Nature connection
- service3.tag3: Apoyo a comunidades | Community support
- service3.h1: Experiencias auténticas | Authentic experiences
- service3.p1: Diseñamos rutas responsables... | We design responsible routes...
- service4.tag1: Itinerarios flexibles | Flexible itineraries
- service4.tag2: Seguro contra todo riesgo | All‑risk insurance
- service4.tag3: Soporte 24/7 | 24/7 support
- service4.h1: Confianza y respaldo | Trust and support
- service4.p1: Nos adaptamos a tus tiempos... | We adapt to your time...
- comments.heading: Opiniones de Aventureros | Adventurers’ reviews
- about.p1: Nevado Trek nace en Salento... | Nevado Trek was born in Salento...
- about.p2: Caminar estas montañas... | Walking these mountains...
- about.p3: En el camino, la fauna... | Along the way, wildlife...
- about.last: Salento, Quindìo 2025 | Salento, Quindío 2025
- mg.last: Donde el frailejón guarda silencio... | Where the frailejón keeps silence...
- footer.madeby: Hecho por Christian Sandoval | Made by Christian Sandoval
- footer.copy: © 2025 Nevado Trek | © 2025 Nevado Trek
- footer.lang: Eng / Esp | EN / ES
- footer.link1: Empleos | Careers
- footer.link2: Prensa y medios | Press & media
- footer.link3: Explorar trabajos | Browse jobs
- footer.link4: Soporte a empleadores | Employer support

## Where keys are bound in index.html
- Elements with data-i18n-key are auto-updated
  - nav links: data-i18n-key="nav.home", "nav.tours", "nav.gallery"
  - header CTA: data-i18n-key="cta.contact"
  - services cards: titles and paragraphs data-i18n-key (service.h1/service.p1, service2.h1/service2.p1, service3.h1/service3.p1, service4.h1/service4.p1)
  - buttons in cards/sections: data-i18n-key on btn.viewTours, btn.viewOnGoogle, cta.contactus
- Other texts updated by selectors in apply(lang):
  - Hero title and tag
  - Section headings (Experiencias, Servicios, Comentarios, FAQ)
  - Intro tickers (intro.t1, intro.t2)
  - About paragraphs and last line
  - Moving gallery last heading
  - Footer: copy, made by, language badge, footer links

## Units and time translations
- Automatically converts:
  - MSNM ↔ MASL
  - Día/Días ↔ Day/Days

## Adding new translatable text
1) Prefer adding data-i18n-key to the element and append the key to both es and en dictionaries in the inline script
2) If a component is difficult to key (e.g., generated structure), add a stable selector in apply(lang) and update it there
3) Keep Spanish as source text in HTML; English will be applied at runtime when selected

## Persistence
- Selected language saved to localStorage("lang") and applied on next visit

## File touched
- index.html: header select, data-i18n-key attributes added to services and buttons, inline i18n script
