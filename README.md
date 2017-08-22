# lab-wiki-backend
NTU NLP lab wiki backend

## Install
Download/install nodejs from [nvm](https://nodejs.org/en/download/package-manager/#nvm), then execute
    
    npm install

## Note

### JWT
[express-jwt](https://github.com/auth0/express-jwt) for JWT verify in [express](http://expressjs.com/). 
[node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for JWT signature(/verify).
[client 儲存 JWT 的方式](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
那麼，JWT 怎麼用呢？
- user login: 成功登入時，server 會 return(by https) 一個 JWT token，browser要把它存在cookie(?)內
- user authenticate: 當 user request 一些有權限需求的網頁時，server decode 他的 JWT token，看看是不是有權限的user/token有沒有過期，都 ok 的話就繼續
- token 內可以存資訊(以 JSON 的格式)，如 `'privilege': 'admin'`
- 會動是因為加解密都於 server 上，client 內只會存密文，是故 client 理論上無法修改 server 給他的資料 (登入狀況)
- server 端必須要有密鑰來加解密 JWT，我們可以以 generate random bytes 的方式在每次開 server 時得到一個新的密鑰(對稱式) (單一server)
- 若多個 server 要使用同一組 JWT，則每台 server 都必須有同一把密鑰

