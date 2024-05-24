#  Бэкенд Movie Dom
_***Backend часть сервиса, с помощью которого пользователь может делиться фото с другими.***_
[Live demo](https://movie-dom.store/)

## Технологии:
<a href="https://nestjs.com/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Nestjs-090909?style=for-the-badge&logo=Nestjs&logoColor=ea2851" alt="Nest.js" /></a>
<a href="https://nodejs.org/ru" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Node.js-090909?style=for-the-badge&logo=Node.js" alt="Node.js" /></a>
<a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-MongoDB-090909?style=for-the-badge&logo=MongoDB" alt="MongoDB" /></a>
<a href="https://www.postman.com/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Postman-090909?style=for-the-badge&logo=Postman" alt="Postman" /></a>
<a href="https://eslint.org/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Eslint-090909?style=for-the-badge&logo=Eslint&logoColor=blue" alt="Eslint" /></a>
<a href="https://jwt.io/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Jsonwebtokens-090909?style=for-the-badge&logo=json-web-tokens&logoColor=d63aff" alt="jwt" /></a>
<a href="https://swagger.io/" target="_blank" rel="noreferrer"><img src="https://img.shields.io/badge/-Swagger-090909?style=for-the-badge&logo=swagger" alt="swagger" /></a>

### Функционал:

+ Регистрация  `POST: /register`
+ Авторизация `POST: /login`
+ Обновление данных пользователя `PATCH: /users`
+ Загрузка файлов `POST: /files`
+ Поиск списка пользователей по email `GET: /users&search=user@email.ru`
+ Получение пользователя по ID `GET: /users/:id`
+ Получение колличество зарегистрированных пользователей`GET: /users/count`
+ Получение списка всех фильмов `GET: /movie`
+ Создание фильма `POST: /movie`
+ Создание жанра фильма `POST: /genre`
+ Создание пользователя `POST: /user`
+ Создание актера `POST: /user`
+ Центральная обработка ошибок
+ Валидация входящих данных
+ Агрегация данных с помощью [Mongoose](https://mongoosejs.com/)
+ Роли пользователей
+ Защита API авторизацией
+ Админка

  [Полный список ендпоинтов](https://movie-dom.store/swagger)
------
### О чём проект?

*Данное серверное приложение предназначено для храниния и обмена файлами с вэб-приложением [Movie Dom](https://github.com/maratdev/next-movie).*

* Возможность зарегестрироваться и залогиниться с помощью почты и пароля. Токен для авторизации хранится 7 дней.
* Можно создавать фильмы. У каждой каточки есть есть поля name, poster (ссылка на картинку), actors (id актера), countOpened (колл. открытия карточки) и массив genres ( id жанров).
* Фильмы можно создавать и удалять, а также ставить оценку и добавлять в избранное.
* Поля валидируются.
------

### Запуск проекта

`npm run start` — запускает сервер   
`npm run start:dev` — запускает сервер с hot-reload


Репозиторий:

```bash
git clone https://github.com/maratdev/movie-nest
```
