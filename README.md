# OpenClaw Pixel Office Dashboard

Una dashboard in stile pixel art per monitorare e gestire gli agenti OpenClaw, con un ufficio virtuale ispirato a Pokémon.

## Struttura
- **Frontend**: React + Vite
- **Stile**: CSS pixel art + sprite animati
- **Backend**: Integrazione con API OpenClaw (via Gateway)
- **Deploy**: Docker + Docker Compose

## Sviluppo
1. Clona la repo:
   ```bash
   git clone https://github.com/MattiaPell/openclaw-pixel-office.git
   ```
2. Installa dipendenze:
   ```bash
   npm install
   ```
3. Avvia in locale:
   ```bash
   npm run dev
   ```

## Docker
Per avviare l'ambiente completo:
```bash
docker-compose up --build
```

**Nota**: Il progetto richiede una rete Docker esterna chiamata `openclaw-net`. Se non esiste, creala con:
```bash
docker network create openclaw-net
```

## TODO
- [x] Mockup UI statico
- [x] Animazioni sprite (agenti, ufficio)
- [x] Integrazione API OpenClaw
- [x] Assegnazione task via UI (Drag & Drop)
- [ ] Visualizzazione log agenti real-time
