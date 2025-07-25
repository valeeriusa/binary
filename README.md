# JobPortal - Website de joburi modern

Un website modern și elegant pentru căutarea joburilor, cu o temă gradient inspirată de YouTube Premium și funcționalități avansate de căutare și filtrare.

## ✨ Caracteristici

### 🎨 Design
- **Gradient modern**: Culori mov, albastru și verde inspirate de YouTube Premium
- **Sidebar transparent**: Design elegant cu efecte de blur
- **Layout responsive**: Optimizat pentru toate dispozitivele
- **Animații fluide**: Tranziții și efecte vizuale atrăgătoare
- **Iconuri FontAwesome**: Pentru o experiență vizuală completă

### 🔍 Funcționalități
- **Căutare inteligentă**: Caută prin titluri, companii, locații și tehnologii
- **Filtre avansate**: Filtrează după tip job, experiență și salariu
- **Toggle view**: Vezi joburile în format grid sau listă
- **Quick links**: Acces rapid la categorii de joburi
- **Notificări**: Feedback vizual pentru acțiuni utilizator
- **Navigare cu tastatura**: Shortcuts pentru căutare (/) și escape (ESC)

### 🚀 Tehnologii utilizate
- **HTML5**: Structură semantică și modernă
- **CSS3**: Variabile CSS, flexbox, grid, gradients, animations
- **JavaScript ES6+**: Funcționalități interactive și moderne
- **FontAwesome**: Iconuri vectoriale
- **Responsive Design**: Mobile-first approach

## 📁 Structura proiectului

```
/
├── index.html          # Pagina principală
├── styles.css          # Stiluri CSS cu tema gradient
├── script.js           # Funcționalități JavaScript
└── README.md          # Documentația proiectului
```

## 🎯 Layout și structură

### Header
- **Logo**: În partea stângă cu icon briefcase
- **Search box**: În centru cu efecte de focus
- **User section**: În dreapta cu butoane de conectare și avatar

### Sidebar transparent
- **Filtre avansate**: Tip job, experiență, salariu
- **Quick links**: Categorii populare de joburi
- **Design glassmorphism**: Fundal transparent cu blur

### Conținut principal
- **Hero section**: Titlu gradient și statistici
- **Job cards**: Layout grid cu animații staggered
- **View toggle**: Schimbarea între grid și listă

### Footer
- **Link-uri utile**: Organizate pe categorii
- **Social media**: Iconuri cu hover effects
- **Design gradient**: Continuarea temei vizuale

## 🎨 Temă și culori

### Gradients principale
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
--gradient-secondary: linear-gradient(135deg, #667eea 0%, #00d4aa 50%, #4facfe 100%);
--gradient-accent: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
```

### Culori sistem
- **Primary**: #667eea (albastru-mov)
- **Secondary**: #00d4aa (verde-albastru)
- **Accent**: #f093fb (roz-mov)
- **Success**: #10b981 (verde)

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small mobile**: sub 480px

### Adaptări responsive
- Sidebar devine stack pe mobile
- Header se reorganizează vertical
- Grid joburi devine single-column
- Footer se adaptează la 2 coloane apoi 1

## ⚡ Funcționalități JavaScript

### Căutare și filtrare
```javascript
// Căutare debounced pentru performanță
const debouncedSearch = debounce(filterJobs, 300);

// Filtrare multiplă: text, tip, salariu
function filterJobs() {
    // Logica de filtrare combinată
}
```

### Animații și tranziții
- **Intersection Observer**: Pentru animații la scroll
- **Staggered animations**: Cards apar progresiv
- **Hover effects**: Micro-interacțiuni plăcute
- **Loading states**: Feedback vizual

### Interactivitate
- **Apply buttons**: Animații și notificări
- **View toggle**: Schimbarea layout-ului
- **Quick links**: Filtrare rapidă după categorie
- **Keyboard shortcuts**: Navigare eficientă

## 🛠️ Instalare și utilizare

### Cerințe
- Python 3.x (pentru server local)
- Browser modern cu suport pentru CSS Grid și ES6

### Pași
1. **Clonează proiectul**:
   ```bash
   git clone <repository-url>
   cd job-website
   ```

2. **Pornește serverul local**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Deschide în browser**:
   ```
   http://localhost:8000
   ```

## 🎪 Demo live

Website-ul rulează local pe `http://localhost:8000` și include:
- 6 joburi sample cu date realiste
- Toate funcționalitățile interactive
- Design complet responsive
- Animații și efecte vizuale

## 🔧 Personalizare

### Modificarea culorilor
Editează variabilele CSS din `:root` în `styles.css`:
```css
:root {
    --gradient-primary: /* noul tău gradient */;
    --color-primary: /* culoarea principală */;
}
```

### Adăugarea de joburi
Modifică array-ul `jobsData` din `script.js`:
```javascript
const jobsData = [
    {
        id: 7,
        title: 'Noul job',
        company: 'Compania ta',
        // ... alte proprietăți
    }
];
```

## 🚀 Funcționalități viitoare

- [ ] Autentificare utilizatori
- [ ] Salvare joburi favorite
- [ ] Aplicare directă cu CV upload
- [ ] Sistem de recomandări
- [ ] Chat cu recruitori
- [ ] Integrare API joburi reale
- [ ] Dashboard pentru angajatori

## 📄 Licență

Acest proiect este open source și disponibil pentru uz personal și comercial.

---

**Dezvoltat cu ❤️ pentru o experiență modernă de căutare a joburilor**
