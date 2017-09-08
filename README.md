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

### Others
| Method | URL                        | Description                  | Parameter           |
|:-------|:---------------------------|:-----------------------------|:-------------------:|
| GET    | http://url/api/gpuUsage    | Get all gpu/cpu usage        |                     |
| GET    | http://url/api/user        | Get current user info        |                     |

## Structure
```
- backend.js      Main Code
- package.json
- config.js       Backend config
- models/         Models scheme
    - ContactList.js
    - News.js
    - Seminar.js
    - Slide.js
- routers/         Route defination
    - index.js         Route defination
    - settings/        Settings for express
    - model.js         Function: DB/model relative things
    - login.js         Function: login/user/google-login relative things
    - gpu-usage.js     Function: get workstation gpu/cpu usage
    - take-out-garbage.js ction: godlike auto take out the garbage by ContactList
    - fake-fe.js       Function: fake front-end for testing
- services/
    - mail-service.js  Mail service
    - gapi-test.js     Kanna tell you taking out the garbage
    - google-api.js    Function: google api things, like getting token in backend
- tools/           Tools
    - data-parser.js   Parse json data into DB
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
- [x] delete 權限 (admin/owner only)
- [x] API route
- [x] dev/product environment
- [x] static folder for front-end
