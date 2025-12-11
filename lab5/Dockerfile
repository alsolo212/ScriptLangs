FROM node:latest

# создаём папку в контейнере
RUN mkdir -p /usr/src/app/

# делаем её рабочей директорией
WORKDIR /usr/src/app/

# копируем всё из проекта внутрь образа
COPY . /usr/src/app/

# ставим зависимости из package.json
RUN npm install

# указываем порт, который слушает приложение
EXPOSE 3000

# команда запуска внутри контейнера
CMD ["node", "app.js"]