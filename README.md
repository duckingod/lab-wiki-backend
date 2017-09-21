[![Build Status](https://travis-ci.com/duckingod/lab-wiki-backend.svg?token=BMv3FopsAyzypbivpLC3&branch=master)](https://travis-ci.com/duckingod/lab-wiki-backend)
# Lab Wiki Backend
NTU NLP lab wiki backend by [express](http://expressjs.com)


## Getting Start
### Install
Download/install nodejs from [nvm](https://nodejs.org/en/download/package-manager/#nvm), then execute
```
npm install
```

### Usage

To open a development webserver in `localhost`:

    npm run data-init-dev
    npm run dev

To depoly a production webserver in server:

    npm run data-init
    npm run start

## APIs

```
url = localhost:3000             (development)
    = nlg17.csie.ntu.edu.tw:3000 (production)
```

View `http://url/api/` for example

### Login Logout
| Method | URL                        | Description                  | Parameter                |
|:-------|:---------------------------|:-----------------------------|:------------------------:|
| POST   | http://url/api/login       | Login with [id_token](https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server)        | `{id\_token: '...', ...}` |
| POST   | http://url/api/logout      | Logout                       |                          |

### CRUD
| Method | URL                        | Description                  | Parameter           |
|:-------|:---------------------------|:-----------------------------|:-------------------:|
| GET    | http://url/api/seminar     | Get all seminar              |                     |
| POST   | http://url/api/seminar     | Create new seminar           |`{topic: '...', ...}`|
| POST   | http://url/api/seminar/:id | Update seminar with id=`:id` |`{topic: '...', ...}`|
| DELETE | http://url/api/seminar/:id | Delete seminar with id=`:id` |                     |

It's same for all data (`seminar`, `news`, `contactList`, ...)

### Other Informations
| Method | URL                              | Description                        | Parameter                |
|:-------|:---------------------------------|:-----------------------------------|:------------------------:|
| GET    | http://url/api/workstations      | Get info of workstations (gpu ...) |                          |
| GET    | http://url/api/takeOutGarbage    | Get garbage                        |                          | 
| GET    | http://url/api/user              | Get current user info              |                          |
| GET    | http://url/api/conference/search | Search conference on [wikicfp](www.wikicfp.com/) | `{q: ...}` |

### Management

Apis below by `POST` are all admin only.

| Method | URL                              | Description                   | Parameter           |
|:-------|:---------------------------------|:------------------------------|:-------------------:|
| POST   | http://url/api/seminar/advance   | Advance the future seminars   |                     |
| POST   | http://url/api/seminar/postpone  | Postpone the future seminars  |                     |
| POST   | http://url/api/seminar/weekday   | Change future seminar weekday | `{weekday: 0~6}`    |
| POST   | http://url/api/garbage/advance   | Advance the garbage schedule  |                     |
| POST   | http://url/api/garbage/postpone  | Postpone the garbage schedule |                     |
| GET    | http://url/api/seminar/next      | Get the coming seminar (test) |                     |
| GET    | http://url/api/system            | Get the system variables      |                     |
| POST   | http://url/api/system            | Set the system variables (not recommend) | `{seminarWeekday: ..., ...}` |

## Structure
```
- backend.js      Main Code
- package.json
- config.js       Backend config
- client_secret.json Client secret for google apis
- models/         Models scheme
    - contactList.js
    - news.js
    - seminar.js
    - slide.js
    - system.js
    - conference.js
    - email.js
- routers/         Route defination
    - index.js         Route defination
    - settings/        Settings for express
    - model.js         Function: DB/model relative things
    - login.js         Function: login/user/google-login relative things
    - gpu-usage.js     Function: get workstation gpu/cpu usage
    - take-out-garbage.js ction: godlike auto take out the garbage by ContactList
    - manage.js        Function: manage backend (scheduling ...)
    - cfp-search.js    Function: search conference on www.wikicfp.com/ 
    - fake-fe.js       Function: fake front-end for testing
- services/
    - index.js         Loads all service
    - mail-service.js  Mail service
    - gapi-test.js     Kanna tell you taking out the garbage
    - google-api.js    Function: google api things, like getting token in backend
- tools/           Tools
    - data-parser.js   Parse json data into DB
- data/            Old wiki data for database initialize
- static/          Front end single page app
- test/            Unit test

```

## TODO
- Data
  - [ ] More data
  - [ ] Record validation
- [x] User role
- [ ] File server
- Security
  - [ ] Session: store session in mongo (production)
  - [x] Session: httpOnly
  - [ ] https
  - [ ] random jwt key (in 'router/login.js')
- Service
  - [x] Mail service
  - [x] Call for paper service
  - [x] Seminar scheduling
  - [x] Take out the garbage scheduling
- [x] delete 權限 (admin/owner only)
- [x] API route
- [x] dev/product environment
- [x] static folder for front-end
