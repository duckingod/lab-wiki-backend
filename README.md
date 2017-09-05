# lab-wiki-backend
NTU NLP lab wiki backend

## Install
Download/install nodejs from [nvm](https://nodejs.org/en/download/package-manager/#nvm), then execute
    
    npm install

## Usage

Development:

    npm run data-init-dev
    npm run dev

Production:

    npm run data-init
    npm run start

## API

```
url = localhost:3000        (development)
    = nlg17.csie.ntu.edu.tw (production)
```

View `http://url/api` for example

### Login Logout

```
// login
POST http://url/api/login
// POST with {id_token: google_auth2_user_id_token}

//logout
POST http://url/api/logout
```

### CRUD

- Get all seminar
```
    GET  http://url/api/seminar
```

- Create new seminar (POST with seminar data : { topic: '...', ... })
```
    POST http://url/api/seminar
```

- Update seminar (id=10) (POST with seminar data : { topic: '...', ... })
```
    POST http://url/api/seminar/10
```

- Delete seminar (id=3)
```
    DELETE http://url/api/seminar/3
```

It's same for all data (`seminar`, `news`, `contactList`)

### Others

- GPU (ensure pchuang's Gpu monitor is on first)
```
    GET  http://localhost:3000/gpuUsage
```

## TODO
- Data
  - [ ] More data
  - [ ] Record validation
- [ ] File server
- Security
  - [ ] Session: store session in mongo (production)
  - [x] Session: httpOnly
  - [ ] https
- [x] delete 權限 (admin/owner only)
- [x] API route
- [x] dev/product environment

