# lab-wiki-backend
NTU NLP lab wiki backend

## Install
Download/install nodejs from [nvm](https://nodejs.org/en/download/package-manager/#nvm), then execute
    
    npm install

## Usage

    npm run dev

To put data into database

    node data-parser.js ../lab-wiki/fakeAPI/data/seminar.json Seminar



## API

View `http://localhost:3000/` for example`

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

It's same for all data

- Get all news
```
GET  http://localhost:3000/news
```

## TODO
- [ ] more data
- [ ] file server
- [ ] Session security
- [ ] httpOnly
- [x] delete 權限 (admin only)
- [ ] https

