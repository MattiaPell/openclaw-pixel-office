# OpenClaw Pixel Office Dashboard

Una dashboard in stile pixel art per monitorare e gestire gli agenti OpenClaw, con un ufficio virtuale ispirato a Pokémon.

![OpenClaw Pixel Office](https://via.placeholder.com/800x400?text=OpenClaw+Pixel+Office)

## ✨ Funzionalità

- 🎨 **Ufficio virtuale in pixel art** con animazioni degli agenti
- 📊 **Monitoraggio agenti** in tempo reale
- 📋 **Gestione task** con drag-and-drop
- 📜 **Log attività** per tracciare tutte le azioni
- 🔄 **Modalità offline** con fallback locale
- 📱 **Responsive design**
- 🎮 **Sprite animati** per ogni stato dell'agente

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- Docker (opzionale)

### Installazione

```bash
# Clona la repository
git clone https://github.com/MattiaPell/openclaw-pixel-office.git
cd openclaw-pixel-office

# Installa dipendenze
npm install

# Avvia in locale
npm run dev
```

### Docker

```bash
# Costruisci e avvia
docker compose up -d

# La dashboard sarà disponibile su http://localhost:3000
```

### Configurazione

Crea un file `.env` nella root del progetto:

```env
VITE_OPENCLAW_GATEWAY_URL=http://localhost:18789
```

Modifica l'URL del Gateway in base alla tua configurazione OpenClaw.

## 🎮 Uso

### Dashboard Principale

- **Vista ufficio**: Mostra gli agenti con i loro sprite animati
- **Lista agenti**: Informazioni dettagliate su ogni agente
- **Coda task**: Task da assegnare agli agenti
- **Log attività**: Cronologia di tutte le azioni

### Assegnazione Task

1. Clicca su **+ NUOVO TASK** per creare un task
2. **Trascina** il task su un agente per assegnarlo
3. L'agente cambierà stato e inizierà a lavorare

### Dettagli Agente

Clicca su un agente per vedere:
- Statistiche (task completati, task attuale)
- Cronologia recente

## 🛠️ Stack Tecnologico

- **React 18** - UI framework
- **Vite** - Build tool
- **CSS Pixel Art** - Stile retro
- **localStorage** - Persistenza locale
- **Docker** - Containerizzazione

## 📁 Struttura Progetto

```
openclaw-pixel-office/
├── src/
│   ├── components/       # Componenti React
│   │   ├── ActivityLog.jsx
│   │   ├── AgentList.jsx
│   │   ├── AgentModal.jsx
│   │   ├── CreateTaskModal.jsx
│   │   ├── OfficeScene.jsx
│   │   └── TaskQueue.jsx
│   ├── hooks/
│   │   └── useOpenClawAPI.js  # Hook per API OpenClaw
│   ├── styles/
│   │   └── *.css
│   ├── utils/
│   │   └── dragDrop.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── sprites/           # Sprite pixel art
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🎨 Personalizzazione

### Sprite

Gli sprite degli agenti si trovano in `public/sprites/`:
- `claw-idle.png` - Agente inattivo
- `claw-working.png` - Agente al lavoro
- `claw-walking.png` - Agente in movimento

### Colori

I colori sono definiti nei file CSS nella cartella `src/styles/`.

## 📝 TODO

- [x] Mockup UI statico
- [x] Animazioni sprite (agenti, ufficio)
- [x] Integrazione API OpenClaw
- [x] Assegnazione task via UI
- [x] Modalità offline con localStorage
- [x] Log attività
- [x] Creazione/modifica task
- [x] Dettagli agente
- [ ] WebSocket per aggiornamenti real-time
- [ ] Badge e achievement
- [ ] Suoni 8-bit
- [ ] Tema scuro/chiaro

## 🤝 Contributi

Le pull request sono benvenute! Per modifiche maggiori, apri prima una issue per discutere cosa vorresti cambiare.

## 📄 Licenza

[MIT](https://choosealicense.com/licenses/mit/)

---

_Sviluppato con ❤️ e pixel art_
