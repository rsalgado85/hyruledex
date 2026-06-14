# HyruleDex — Compendio de The Legend of Zelda

> Un compendio interactivo del universo Zelda — personajes, jefes, armas, criaturas, mapas, videojuegos y más. Construido con React 19, TypeScript y la estética Triforce.

![Version](https://img.shields.io/badge/version-2.0.0-gold)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)
![License](https://img.shields.io/badge/license-MIT-green)

🔗 **[hyruledex.vercel.app](https://hyruledex.vercel.app)**

---

## 🛡️ Módulos

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Vista principal con personajes destacados, jefes aleatorios, KPIs y modales de detalle |
| **Personajes** | 21 personajes (Link, Zelda, Ganondorf, campeones, sabios…) con filtro por raza y estadísticas |
| **Jefes** | 27 jefes finales y de mazmorra — stats, dificultad, dungeon de origen |
| **Armas** | 43 ítems: espadas, escudos, arcos, armaduras y objetos — barras ATK/DEF animadas |
| **Criaturas** | Bestiario del Compendio de Hyrule vía API — criaturas y monstruos con detalle emergente |
| **Objetos** | Objetos clásicos de la saga |
| **Mapas** | Mapas interactivos de Hyrule |
| **Favoritos** | Guarda personajes, jefes y criaturas favoritos |
| **Comparador** | Comparación lado a lado de personajes |
| **Línea de tiempo** | 14 juegos con historia, subtítulos y curiosidades (EN/ES) |
| **Trucos** | 90 trucos, secretos, glitches y easter eggs en 9 juegos |
| **Videojuegos** | 195+ juegos de Zelda vía RAWG API con búsqueda y paginación |
| **Lore** | Historia y trasfondo del universo Zelda |

---

## 🎨 Diseño

- **Tema oscuro Triforce** — dorado `#C6A15B`, verde `#3E6B48`, fondos glassmorphism
- **Navegación inferior móvil** con iconos y barra lateral completa en desktop
- **Bilingüe** — español e inglés en todos los módulos
- **Animaciones** — Framer Motion con `whileInView`, barras de stats animadas, modales con `AnimatePresence`
- **Filtro por raza** — pills clickeables que filtran personajes en tiempo real
- **Imágenes locales** — renders oficiales de pidgi.net, zeldawiki.wiki y Spriters Resource

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| React 19 | UI |
| TypeScript | Tipado |
| Vite | Build |
| React Router v7 | Navegación SPA |
| Zustand | Estado global (tema, idioma, favoritos) |
| Tailwind CSS v4 | Estilos |
| Framer Motion | Animaciones |
| Lucide React | Iconografía |

---

## 📁 Estructura

```
src/
├── app/              # Configuración de la app
├── components/       # Componentes reutilizables
│   ├── common/       # Sidebar, MobileBottomNav, KPICard, SearchBar…
│   └── layout/       # Layout principal
├── pages/            # 19 páginas (Dashboard, Characters, Bosses, Weapons…)
├── store/            # Zustand (useAppStore)
├── constants/        # Colores de raza, traducciones, config
├── hooks/            # Hooks personalizados
├── services/         # Clientes API (Hyrule Compendium, RAWG)
├── types/            # Tipos TypeScript
└── styles/           # Estilos globales y tema Triforce
```

---

## 🚀 Desarrollo

### Requisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
git clone https://github.com/rsalgado85/hyruledex.git
cd hyruledex
npm install
npm run dev
```

### Build

```bash
npm run build    # TypeScript + Vite
npm run preview  # Previsualizar build
```

---

## ▲ Deploy en Vercel

El proyecto se despliega automáticamente en Vercel al pushear a `main`.

```bash
git push origin main
```

Producción: **[hyruledex.vercel.app](https://hyruledex.vercel.app)**

---

## 🌐 APIs utilizadas

- **[Hyrule Compendium API](https://api.hyrule-compendium.com/)** — criaturas y monstruos
- **[RAWG API](https://rawg.io/apidocs)** — catálogo de videojuegos de Zelda

---

## 🗂️ Assets

Todas las imágenes son locales en `/public/`:

| Carpeta | Contenido |
|---------|-----------|
| `public/characters/` | 21 personajes (PNG, fondo transparente) |
| `public/bosses/` | 27 jefes |
| `public/weapons/` | 43 ítems (espadas, escudos, arcos, armaduras) |
| `public/creatures/` | Criaturas del compendio |

---

## 📝 Licencia

MIT — [LICENSE](LICENSE)

---

Construido con ❤️ y la Trifuerza del Valor ⚔️
