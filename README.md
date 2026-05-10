# 🌤 Atmosfera — Weather Intelligence Dashboard

> A real-time weather dashboard built with pure HTML, CSS & JavaScript. No frameworks. No dependencies. Just craft and code.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![WeatherAPI](https://img.shields.io/badge/WeatherAPI-38bdf8?style=flat&logoColor=white)
![Canvas API](https://img.shields.io/badge/Canvas_API-6366f1?style=flat&logoColor=white)

---
## 🚀 Live Demo
🔗[![Click Me!](https://tempfind.netlify.app/)]

## 📸 Preview

| Dark Mode | Light Mode |
|-----------|------------|
| Deep space aurora aesthetic | Soft sky blue glassmorphism |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Real-Time Weather** | Live conditions from WeatherAPI — temperature, humidity, wind, pressure, visibility |
| ⏱ **24-Hour Forecast** | Hour-by-hour breakdown with rain probability for the current day |
| 📅 **3-Day Outlook** | Daily high/low, conditions, and precipitation chance for 3 days ahead |
| ☀️ **UV Index Tracking** | UV level with severity label — Low, Moderate, High, Very High, Extreme |
| 📍 **GPS Geolocation** | One-tap detection of current location via the browser Geolocation API |
| 🌡️ **Unit Toggle** | Switch between Celsius and Fahrenheit instantly without re-fetching |
| 🔍 **Recent Searches** | Last 6 cities persisted in `localStorage` — revisit in one click |
| 🌙 **Day / Night Mode** | Manual toggle with auto-detection based on local clock (6 AM – 7 PM = day) |
| 🎨 **Dynamic Backgrounds** | Aurora canvas shifts color palette based on weather condition (sunny, rain, storm, snow, cloud) |
| 📱 **Fully Responsive** | Fluid layout from 380 px mobile up to wide desktop screens |

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup with ARIA labels for accessibility
- **CSS3** — Custom properties, glassmorphism, `backdrop-filter`, CSS animations, responsive grid
- **Vanilla JavaScript (ES6+)** — No libraries, no bundler
- **Canvas API** — Procedural aurora wave + particle animation
- **WeatherAPI.com** — Weather data (current, hourly, 3-day forecast)
- **Google Fonts** — Bebas Neue (display) + DM Sans (body)

---

## 📁 Project Structure

```
atmosfera/
├── index.html      # App shell — header, search, weather output, features, footer
├── style.css       # All styling — variables, glass cards, aurora, responsive layout
├── script.js       # App logic — aurora canvas, fetch, render, state management
└── README.md       # This file
```

---

## 🚀 Getting Started

No build step required. Just open the file.

### Option 1 — Direct Open
```bash
# Clone or download the repo, then:
open index.html
```

### Option 2 — Local Dev Server (recommended to avoid CORS on some browsers)
```bash
# Using VS Code Live Server extension, or:
npx serve .

# Or with Python:
python -m http.server 8000
# Visit http://localhost:8000
```

> **Note:** The app calls `https://api.weatherapi.com` — an internet connection is required. The API key is included for demo purposes.

---

## 🔑 API Key

This project uses [WeatherAPI.com](https://www.weatherapi.com). The key in the source is for demonstration:

```js
const API_KEY = 'd8abfc3446fc40ce91952814252108';
```

To use your own key:
1. Sign up free at [weatherapi.com](https://www.weatherapi.com)
2. Copy your key from the dashboard
3. Replace the value of `API_KEY` in `script.js`

---

## 🎨 Design System

### Color Palette (Dark)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#060912` | Page background |
| `--glass` | `rgba(255,255,255,0.052)` | Card backgrounds |
| `--accent` | `#38bdf8` | Sky blue — buttons, badges, links |
| `--hot` | `#fb923c` | Temperature display |
| `--cold` | `#60a5fa` | Low temp / cold accent |

### Typography
| Role | Font | Style |
|---|---|---|
| Display / Numbers | Bebas Neue | Uppercase, tracking, condensed |
| Body / UI | DM Sans | 300–600 weight, clean |

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full (`-webkit-backdrop-filter` included) |
| Mobile (iOS / Android) | ✅ Responsive |

---

## ♿ Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`)
- ARIA labels on all interactive controls
- `role="status"` / `role="alert"` on state panels for screen reader announcements
- Keyboard navigable (Tab + Enter)
- Color contrast compliant on key text elements

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| `> 860px` | Full 3-column footer, 3-column feature grid |
| `≤ 860px` | 2-column feature grid, stacked footer brand row |
| `≤ 600px` | Header nav hidden, 2-column stats, 1-column features |
| `≤ 380px` | 1-column stats, smaller display font sizes |

---

## 👤 Author

**Nitin Tiwari**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/nitin-tiwari-272508281)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/nitin811)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](mailto:nitinks3366@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Weather data by <a href="https://www.weatherapi.com">WeatherAPI.com</a> &nbsp;·&nbsp;
  Built with ❤️ by Nitin Tiwari
</p>
