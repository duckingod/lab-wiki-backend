module.exports = (clientId, user) => {

      if (user!=null)
        user_msg = 'Welcome, '+user.name+' ('+user.email+')';
      else
        user_msg = 'Welcome, guest';
      return `
      <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="`+clientId+`">
      </head>
      <body>
        `+user_msg+`
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
        <a href='#' on-click='logout'>Logout?</a>
        <script>
        function onSignIn(user) {
          $.post( 'login', { id_token: user.getAuthResponse().id_token }, 
              (data, stat) => { alert('success'); } );
          }; 
        function logout(){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then( function() { alert('logout'); });
          };
        </script>
        <form action="/seminar" method="POST">
          <input type="text" name="topic" placeholder="Title"/>
          <input type="text" name="presenter" placeholder="Presenter"/>
          <input type="text" name="date" placeholder="Date"/>
          <input type="text" name="slides" placeholder="slides url"/>
          <input type="submit"/>
        </form>
        <form action="/seminar/2" method="POST">
          <input type="text" name="topic" placeholder="Title"/>
          <input type="text" name="presenter" placeholder="Presenter"/>
          <input type="text" name="date" placeholder="Date"/>
          <input type="text" name="slides" placeholder="slides url"/>
          <input type="submit" value='update 2'/>
        </form>
          <a href='#' onclick='go_delete(3)'> delete 3</a>
        <script>
          function go_delete(n){
            alert("go del");
            $.ajax({
                url: 'seminar/3',
                type: 'UPDATE',
                success: function(res) { }
              })
          }
        </script>

      </body>
      `

}
