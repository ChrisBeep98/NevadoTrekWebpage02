# 🌐 Sistema de Idiomas e i18n

Este documento describe la arquitectura de internacionalización y el funcionamiento del selector de idiomas en **Nevado Trek**.

---

## 🛠️ Componentes del Sistema

El sistema se basa en dos archivos principales:
1.  **`js/i18n.js`**: Contiene el diccionario de traducciones (`NT_I18N`) y la lógica para aplicar los textos a los elementos con el atributo `data-i18n-key`.
2.  **`js/navbar-handler.js`**: Maneja la interfaz del selector (dropdown), las banderas y la persistencia en `localStorage`.

---

## 🔄 Funcionamiento del Selector

El selector de idiomas utiliza una lógica **robusta** diseñada para funcionar con cualquier estructura de CSS:

### Lógica de Toggle
El script aplica la clase `.show` tanto al contenedor padre (`.lang-dropdown`) como a la lista de opciones (`#lang-options`). Esto garantiza que el dropdown se despliegue correctamente independientemente de qué archivo CSS esté definiendo las reglas de visibilidad.

### Persistencia
- Cuando el usuario selecciona un idioma, este se guarda en `localStorage.setItem('lang', '...')`.
- Al cargar cualquier página, el sistema lee este valor y aplica automáticamente el idioma guardado.
- Se dispara un evento personalizado `languageChange` para notificar a otros componentes que el idioma ha cambiado.

---

## 📝 Cómo Añadir Traducciones

1. Abre `js/i18n.js`.
2. Localiza el objeto `dict`.
3. Añade tu nueva clave bajo los nodos correspondientes para cada idioma (`es`, `en`).

Ejemplo:
```javascript
"nav": {
  "home": { "es": "Inicio", "en": "Home" },
  "new_key": { "es": "Nueva", "en": "New" }
}
```

En el HTML, usa:
```html
<span data-i18n-key="nav.new_key">Texto por defecto</span>
```

---

## ⚠️ Notas Técnicas

> [!IMPORTANT]
> **Soporte de Atributos:** El sistema i18n no solo traduce el `textContent`, también puede traducir atributos como `placeholder` si se configura en `i18n.js`. Actualmente está optimizado para contenido de texto.

> [!TIP]
> **Banderas:** Las banderas se cargan dinámicamente desde `flagcdn.com`. Si una bandera no carga, verifica el atributo `data-flag` en las opciones del dropdown dentro de `index.html`.
