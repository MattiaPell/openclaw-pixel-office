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
```bash
docker-compose up --build
```

## TODO
- [x] Mockup UI statico
- [ ] Animazioni sprite (agenti, ufficio)
- [ ] Integrazione API OpenClaw
- [ ] Assegnazione task via UI
