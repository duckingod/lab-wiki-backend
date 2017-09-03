# lab-wiki-backend
NTU NLP lab wiki backend

## Install
Download/install nodejs from [nvm](https://nodejs.org/en/download/package-manager/#nvm), then execute
    
    npm install

## Usage
Development:

    npm run dev

Production:

    npm run start


To put data into database

    node data-parser.js ../lab-wiki/fakeAPI/data/seminar.json Seminar



## API

View `http://localhost:3000/` for example`

### Login/logout

- login
```
POST http://localhost:3000/login
// POST with {id_token: google_auth2_user_id_token}
```

- logout
```
POST http://localhost:3000/logout
```

### CRUD

- Get all seminar
```
GET  http://localhost:3000/seminar
```

- Create new seminar
```
POST http://localhost:3000/seminar
// POST with seminar data : { topic: '...', ... }
```

- Update seminar (id=10)
```
POST http://localhost:3000/seminar/10
// POST with seminar data : { topic: '...', ... }
```

- Delete seminar (id=3)
```
DELETE http://localhost:3000/seminar/3
```

It's same for all data (`seminar`, `news`, `contactList`)

### Others

- GPU (ensure pchuang's Gpu monitor is on first)
```
GET  http://localhost:3000/gpuUsage
```

## TODO
- [ ] more data
- [ ] file server
- [ ] Session security
  - [ ] production: store in mongo
  - [x] httpOnly
- [x] httpOnly
- [x] delete 權限 (admin/owner only)
- [ ] https

