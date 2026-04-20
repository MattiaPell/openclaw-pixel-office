# Dockerfile per OpenClaw Pixel Office Dashboard
FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package.json ./
COPY vite.config.js ./

# Installa dipendenze e serve
RUN npm install && npm install -g serve

# Copia il resto dell'applicazione
COPY . ./

# Costruisci l'applicazione
RUN npm run build

# Esponi la porta
EXPOSE 3000

# Avvia l'applicazione con serve (più stabile di vite preview)
CMD ["serve", "-s", "dist", "-l", "3000"]
