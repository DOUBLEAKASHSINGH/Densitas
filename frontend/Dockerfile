FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

# Expose host to allow docker port mapping to work with Vite
CMD ["npm", "run", "dev", "--", "--host"]
