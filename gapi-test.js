let getAuth = require("./google-api").getAuth
let sendMessage = require("./google-api").sendMessage

let name = "林瑋柔大神"
let subject = `Keep our lab clean (${name})`
let body = `Dear lab members,<br>
<br>
${name} will take responsibility for keeping our lab clean during 9/20(Sun)~9/26(Sat), 2017.<br>
We appreciate for his/her efforts.<br>
<br>
Best Regards,<br>
Kanna<br>
<img src="http://i.imgur.com/1BdSXSDg.png" style="width: 150px">
`

getAuth().then(auth => {
  sendMessage(auth, "thyang@nlg.csie.ntu.edu.tw", subject, body)
})
