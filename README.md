Minimal Underscore.js-based Template Engine
===========================================

mute.js is a simple client-side template engine with caching capabilities based on underscore.js.


Simple Usage Scenario
=====================

yourSite.html

```html
<!doctype html>
<meta charset="utf-8">
<title>My cool site</title>
<form action="#" id="js-login">
  <input type="text" name="username" placeholder="Username" autofocus>
  <input type="password" name="password" placeholder="Password">
  <input type="submit" value="Login">
</form>
<div role="main">
</div>
```

yourSite.js (using jQuery)

```javascript
var mytpl = mute('div[role="main"]', '/templates', '/templates');

$('#js-login input[type="submit"]').click = function (e) {
  e.preventDefault();
  mytpl.render(
    'login',
    {
      username: $('#js-login input[name="username"]').val(),
      password: $('#js-login input[name="password"]').val()
    }
  );
}
```

templates/login.js

```javascript
muteScript('login', function (render, data) {
  // Do login check logic on data.username and data.password
  if (logedIn) {
    data.message = 'Welcome ' + data.username + '!';
  } else {
    data.message = 'Your login failed!';
  }
  render(data);
});
```

template/login.ejs

```ejs
<h1>Login Page</h1>
<p><%= message %></p>
```