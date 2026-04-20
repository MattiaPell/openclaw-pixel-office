# Dockerfile per OpenClaw Pixel Office Dashboard
FROM node:20-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package.json ./
COPY vite.config.js ./

# Installa dipendenze
RUN npm install

# Copia il resto dell'applicazione
COPY . ./

# Costruisci l'applicazione
RUN npm run build

# Esponi la porta
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "run", "preview"]