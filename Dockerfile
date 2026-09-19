# Étape 1 : Build de l'application React
FROM node:18-alpine AS build

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Construction de l'application pour la production
RUN npm run build

# Étape 2 : Serveur Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis l'étape 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port 80 (par défaut pour Nginx)
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
