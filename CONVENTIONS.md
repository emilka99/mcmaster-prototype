# McMaster Prototype — Konwencje

## Ikony
Używamy wyłącznie Google Material Symbols (outlined).
Biblioteka: https://fonts.google.com/icons

Import w index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

Użycie w JSX:
```jsx
<span className="material-symbols-outlined">bookmark</span>
```

Rozmiar przez font-size, kolor przez color — dziedziczone z rodzica.

Wariant filled (aktywne stany):
```jsx
<span className="material-symbols-outlined filled">bookmark</span>
```

Klasy rozmiarów: `icon-sm` (18px), `icon-md` (24px), `icon-lg` (32px), `icon-xl` (48px)

## Emoji
Zakaz używania emoji w UI — ani w JSX, ani w CSS content, ani w mock data labelach.
Emoji tylko w komentarzach w kodzie jeśli absolutnie konieczne.

## Mapa ikon (SVG/emoji → Material Symbol)
| Stary zapis | Material Symbol |
|---|---|
| `📖` | `book_2` |
| `📁` | `folder` |
| `🔖` | `bookmark` |
| `📝` | `edit_note` |
| `⏱` | `schedule` |
| `📵` | `wifi_off` |
| `🎬` | `play_circle` |
| `🧮` | `calculate` |
| `❤️` | `favorite` |
| `🧠` | `neurology` |
| `⚗️` | `science` |
| `🫁` | `air` |
| `⭐` | `star` |
| `✕` | `close` |
| `›` (jako ikona) | `chevron_right` |
| `←` (jako ikona) | `arrow_back` |
| `→` (jako ikona) | `arrow_forward` |
| `▶` | `play_arrow` |
| Lupa/search | `search` |
| Siatka | `grid_view` |
| Stos/layers | `menu_book` |
| Wifi off | `wifi_off` |
| Zakładka | `bookmark` |
| Notatka | `edit_note` |
| Zegar | `schedule` |
| Folder | `folder` |
| Lista | `format_list_bulleted` |
| Trzy kropki | `more_vert` |
| Zamknij | `close` |
| Rozwiń | `expand_more` |
| Osoba | `person` |
| Globus | `language` |
| Dzwonek | `notifications` |
| Chmura | `cloud_download` |
| Karta | `credit_card` |
| Pomoc | `help` |
| Plus | `add` |

## Zakaz inline SVG ikon
Nie definiujemy własnych komponentów `const IconXxx = () => <svg>...` dla ikon UI.
Wyjątek: unikalne ilustracje (np. logo, diagramy medyczne) — tylko wtedy inline SVG.
