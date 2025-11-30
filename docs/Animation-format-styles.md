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

Testimonials Looping:
"Make the cards animate marquis in an infinite loop with alpha mask slowly."








{
  "design_system": {
    "meta": {
      "mode": "light",
      "theme_name": "Casa Angelina Concierge",
      "base_background": "#FFFFFF"
    },
    "fonts": {
      "primary": {
        "family": "Geometria",
        "weights": [300, 400, 500, 600],
        "usage": "UI elements, navigation, labels, forms"
      },
      "secondary": {
        "family": "LM Roman",
        "weights": ["normal"],
        "usage": "Body text, subtitles, mini titles"
      },
      "display": {
        "family": "Notera",
        "weights": ["normal"],
        "usage": "Decorative titles (e.g., Brownie titles)"
      }
    },
    "colors": {
      "background": {
        "default": "#FFFFFF",
        "paper": "#FFFFFF",
        "brownie_back": "#a8a297",
        "beige_light": "#EAE6E0",
        "beige_medium": "#D7D2CB"
      },
      "text": {
        "primary": "#6E6259",
        "secondary": "#B6ADA5",
        "tertiary": "#8C8279",
        "dark_mode_accent": "#9d968d",
        "black": "#333333"
      },
      "ui": {
        "border": "#e6e6e6",
        "highlight": "#569ff7",
        "error": "#ff0000"
      }
    },
    "spacing": {
      "layout": {
        "margin_standard": "5vw",
        "container_width": "calc(100% - 15.5vw)",
        "header_height": "90px",
        "header_padding": "20px"
      },
      "components": {
        "button_padding": "0 12px",
        "card_padding": "10px"
      }
    },
    "shadows": {
      "soft": "0 3px 13px rgba(0,0,0,0.08)",
      "border_sim": "1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6, 0 -1px 0 #e6e6e6"
    },
    "layout": {
      "type": "flexbox",
      "container_max_width": "100%",
      "z_indices": {
        "header": 3,
        "overlay": 3,
        "nav": 2
      }
    },
    "adaptive_layout_specs": {
      "mobile_breakpoint": "960px",
      "tablet_breakpoint": "1365px",
      "mobile_styles": {
        "header_height": "30px",
        "margin_standard": "30px",
        "container_width": "calc(100% - 60px)",
        "font_scaling": {
          "text": "16px",
          "detail_title": "30px"
        }
      }
    },
    "buttons": {
      "main": {
        "height": "36px",
        "border_radius": "20px",
        "background": "#FFFFFF",
        "text_color": "#393939",
        "font_family": "Geometria",
        "font_size": "13px",
        "icon_fill": "#9c998f"
      },
      "secondary": {
        "height": "38px",
        "width": "38px",
        "border_radius": "50%",
        "background": "transparent",
        "icon_fill": "#FFFFFF"
      },
      "hover_states": {
        "opacity": "0.8",
        "transform": "scale(1.05)"
      }
    },
    "animations": {
      "transitions": {
        "slow": "1500ms ease",
        "medium": "1000ms ease",
        "fast": "400ms ease"
      },
      "keyframes": {
        "spinning": "0% { stroke-dashoffset: 87 } 50% { stroke-dashoffset: 174 } 100% { stroke-dashoffset: 261 }"
      },
      "instructions": {
        "fade_in_up": "transform: translateY(20px) -> 0; opacity: 0 -> 1",
        "reveal": "transform: scale(0,1) -> scale(1,1)",
        "circle_draw": "stroke-dashoffset: 113 -> 0"
      }
    },
    "icons": {
      "set_type": "SVG",
      "style": "Minimalist, Line & Fill",
      "logos": {
        "main": "Casa Angelina Text Logo",
        "symbol": "CA Monogram"
      },
      "common_icons": [
        "arrow_right",
        "circle_outline",
        "menu_hamburger",
        "close_cross",
        "social_facebook",
        "social_instagram",
        "phone",
        "email"
      ]
    }
  }
}


{
  "design_system": {
    "meta": {
      "mode": "light",
      "theme_name": "Casa Angelina Concierge",
      "base_background": "#FFFFFF"
    },
    "fonts": {
      "primary": {
        "family": "Geometria",
        "weights": [300, 400, 500, 600],
        "usage": "UI elements, navigation, labels, forms"
      },
      "secondary": {
        "family": "LM Roman",
        "weights": ["normal"],
        "usage": "Body text, subtitles, mini titles"
      },
      "display": {
        "family": "Notera",
        "weights": ["normal"],
        "usage": "Decorative titles (e.g., Brownie titles)"
      }
    },
    "colors": {
      "background": {
        "default": "#FFFFFF",
        "paper": "#FFFFFF",
        "brownie_back": "#a8a297",
        "beige_light": "#EAE6E0",
        "beige_medium": "#D7D2CB"
      },
      "text": {
        "primary": "#6E6259",
        "secondary": "#B6ADA5",
        "tertiary": "#8C8279",
        "dark_mode_accent": "#9d968d",
        "black": "#333333"
      },
      "ui": {
        "border": "#e6e6e6",
        "highlight": "#569ff7",
        "error": "#ff0000"
      }
    },
    "spacing": {
      "layout": {
        "margin_standard": "5vw",
        "container_width": "calc(100% - 15.5vw)",
        "header_height": "90px",
        "header_padding": "20px"
      },
      "components": {
        "button_padding": "0 12px",
        "card_padding": "10px"
      }
    },
    "shadows": {
      "soft": "0 3px 13px rgba(0,0,0,0.08)",
      "border_sim": "1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6, 0 -1px 0 #e6e6e6"
    },
    "layout": {
      "type": "flexbox",
      "container_max_width": "100%",
      "z_indices": {
        "header": 3,
        "overlay": 3,
        "nav": 2
      }
    },
    "adaptive_layout_specs": {
      "mobile_breakpoint": "960px",
      "tablet_breakpoint": "1365px",
      "mobile_styles": {
        "header_height": "30px",
        "margin_standard": "30px",
        "container_width": "calc(100% - 60px)",
        "font_scaling": {
          "text": "16px",
          "detail_title": "30px"
        }
      }
    },
    "buttons": {
      "main": {
        "height": "36px",
        "border_radius": "20px",
        "background": "#FFFFFF",
        "text_color": "#393939",
        "font_family": "Geometria",
        "font_size": "13px",
        "icon_fill": "#9c998f"
      },
      "secondary": {
        "height": "38px",
        "width": "38px",
        "border_radius": "50%",
        "background": "transparent",
        "icon_fill": "#FFFFFF"
      },
      "hover_states": {
        "opacity": "0.8",
        "transform": "scale(1.05)"
      }
    },
    "animations": {
      "transitions": {
        "slow": "1500ms ease",
        "medium": "1000ms ease",
        "fast": "400ms ease"
      },
      "keyframes": {
        "spinning": "0% { stroke-dashoffset: 87 } 50% { stroke-dashoffset: 174 } 100% { stroke-dashoffset: 261 }"
      },
      "instructions": {
        "fade_in_up": "transform: translateY(20px) -> 0; opacity: 0 -> 1",
        "reveal": "transform: scale(0,1) -> scale(1,1)",
        "circle_draw": "stroke-dashoffset: 113 -> 0"
      }
    },
    "icons": {
      "set_type": "SVG",
      "style": "Minimalist, Line & Fill",
      "logos": {
        "main": "Casa Angelina Text Logo",
        "symbol": "CA Monogram"
      },
      "common_icons": [
        "arrow_right",
        "circle_outline",
        "menu_hamburger",
        "close_cross",
        "social_facebook",
        "social_instagram",
        "phone",
        "email"
      ]
    }
  }
}   