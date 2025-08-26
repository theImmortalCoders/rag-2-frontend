FROM node:20.11-alpine AS build

#lib
WORKDIR /app

COPY rag-2-games ./rag-2-games
WORKDIR /app/rag-2-games
RUN npm install
RUN npm run games:build
RUN npm run games:link

#front
WORKDIR /app/rag-2-frontend
COPY . .

RUN npm install
RUN npm run games:import
RUN npm run build --prod

FROM nginx:latest AS ngi
COPY --from=build /app/rag-2-frontend/dist/rag-2-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

