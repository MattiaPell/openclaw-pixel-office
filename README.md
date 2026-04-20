# OpenClaw Pixel Office Dashboard

Una dashboard moderna ed accattivante in stile "Glassmorphism" per monitorare e gestire gli agenti OpenClaw, con un ufficio virtuale in pixel art.

![OpenClaw Pixel Office](https://via.placeholder.com/800x400?text=OpenClaw+Pixel+Office+Modern)

## ✨ Funzionalità

### Core & UI
- 🎨 **Design Moderno**: Estetica "Glassmorphism" con trasparenze, sfocature e gradienti dinamici.
- 📂 **Struttura Multi-pagina**: Navigazione fluida tramite Sidebar tra Ufficio, Agenti, Task e Attività.
- 🖼️ **Ufficio virtuale in pixel art**: Scene animate con agenti che camminano, lavorano o riposano.
- 📋 **Tabella Kanban**: Gestione dei task tramite una board a tre colonne (Da fare, In Corso, Completato).
- 👤 **Gestione Agenti**: CRUD completo (Crea, Leggi, Aggiorna, Elimina) degli agenti con profili dettagliati.
- 🔄 **Real-time & Local**: Supporto per WebSocket/Polling e modalità offline con persistenza locale.

### Gamification & Extra
- 🏆 **Achievements**: Sistema di badge sbloccabili in base alle performance.
- 🔊 **Feedback Sonoro**: Effetti 8-bit per un'esperienza immersiva.
- 🌗 **Temi Dinamici**: Supporto per modalità Scura, Chiara e Retro.

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
npm run docker:build
npm run docker:run

# La dashboard sarà disponibile su http://localhost:3000
```

## 🎮 Organizzazione del Lavoro

### 🏢 Office (Ufficio)
La vista panoramica dove puoi vedere i tuoi agenti interagire con l'ambiente pixel-art. Gli agenti cambiano animazione in base al loro stato attuale.

### 👥 Agenti
Gestisci la tua squadra di agenti OpenClaw. Puoi aggiungere nuovi agenti, modificare le loro identità e modelli, o rimuoverli dalla dashboard.

### 📋 Task (Kanban)
Organizza il lavoro tramite una board Kanban intuitiva:
- **Da fare**: Task appena creati.
- **In Corso**: Task assegnati ed in fase di elaborazione.
- **Completato**: Archivio dei lavori terminati con successo.

### 📜 Attività
Un log dettagliato e cronologico di tutte le azioni avvenute nel sistema, utile per il debugging e il monitoraggio delle performance.

## 🛠️ Stack Tecnologico

- **React 18** - Framework UI
- **Vite** - Build tool ultra-veloce
- **CSS Moderno** - Glassmorphism, variabili CSS e animazioni avanzate
- **WebSocket** - Aggiornamenti real-time
- **localStorage** - Persistenza dei dati in locale

## 📁 Struttura Progetto

```
openclaw-pixel-office/
├── src/
│   ├── components/       # Componenti React
│   │   ├── Sidebar.jsx          # Navigazione principale
│   │   ├── OfficePage.jsx       # Pagina Ufficio
│   │   ├── AgentsPage.jsx       # Pagina Gestione Agenti
│   │   ├── TasksPage.jsx        # Pagina Kanban Task
│   │   ├── ActivityPage.jsx     # Pagina Log Attività
│   │   ├── OfficeScene.jsx      # Scena Pixel Art
│   │   ├── AgentList.jsx        # Lista/Card Agenti
│   │   └── ...
│   ├── hooks/
│   │   └── useOpenClawAPI.js    # Logica API e stato
│   ├── styles/
│   │   └── *.css                # Stili modulari
│   ├── App.jsx
│   └── main.jsx
└── ...
```

## 🚀 Evoluzioni Future (Roadmap)

Siamo costantemente al lavoro per rendere l'ufficio degli agenti più efficiente e divertente. Ecco alcune delle evoluzioni pianificate:

### Alta priorità
- [ ] **Visualizzazione dei dati della dashboard originale**
- [ ] **Nuovo design per gli agent**: Uno stile più umano con il corpo completo.
- [ ] 📊 **Advanced Analytics**: Dashboard con grafici sulle performance degli agenti, tempi medi di completamento e statistiche di utilizzo modelli.
- [ ] 🌿 **Nuovi Temi & Ambienti**: Ambientazioni alternative per l'ufficio (es. Cyberpunk City, Foresta Incantata, Base Spaziale).
### Media Priorità
- [ ] 📥 **Esportazione Dati**: Possibilità di scaricare i log di attività e i report dei task in formato CSV o JSON.
- [ ] 📱 **Mobile Optimization (PWA)**: Miglioramento dell'interfaccia per dispositivi mobili e installazione come Progressive Web App.
### Bassa priorità
- [ ] 🔔 **Notifiche Push**: Ricevi avvisi sul browser quando un task viene completato o se un agente richiede attenzione.
- [ ] 🔑 **Multi-user & Auth**: Sistema di login per gestire uffici separati per diversi utenti o team.
- [ ] 🤖 **Integrazione Multi-Provider**: Supporto nativo per connettersi contemporaneamente a più gateway OpenClaw.

## 🤝 Contributi

Le pull request sono benvenute! Per modifiche maggiori, apri prima una issue per discutere cosa vorresti cambiare.

## 📄 Licenza

[MIT](https://choosealicense.com/licenses/mit/)

---

_Sviluppato con ❤️, pixel art e un tocco di modernità_
