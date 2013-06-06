mute.js
=======

mute.js is a **m**inimalistic, **u**nderscore.js-based **t**emplate **e**ngine that used EJS (embedded JavaScript) as templating language. It is simple, client- or server-side, and provides caching capabilities.

Why?

1. EJS (embedded JavaScript) is the best templating language
2. Existing solutions are not satiffying
  - http://embeddedjs.com/ completely lacks documentation, has to much functionality, and is not that actively developed.
  - underscore.js' template function is simple, but lacks convenience.

mute.js was developed as a layer above underscore.js to provide a comfortable usage while staying small and simple.

Install
=======

mute.js uses underscore.js, therefore, if not already present, you have to load underscore.js.

Now just load the script, it will create a *mute* object in the browser's global scope.

Usage Scenario 1 - Set inner HTML of element
============================================

Some source and explanation for a client-side usage scenario.

Source
------

yourSite.html

```html
<!doctype html>
<meta charset="utf-8">
<script src="yourSite.js"></script>
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

```html
<h1>Login Page</h1>
<p><%= message %></p>
```

Explanation
-----------

- **yourSite.html** defines the HTML skeleton. It might contain header, footer, navigation, .... It's &lt;div role="main" /&gt; remains empty, as it is to be filled with content through mute.js.
- **yourSite.js** is you regular site-managing JavaScript. Here, an event handler for the submit button in the login form of the HTML page is defined. If the submit button is clicked, the form data is submitted to mute.js' render function.
- **templates/login.js** contains all code to process the given information.
  - **render** is the callback function that has to be called with an object, which's properties should be available in the template.
  - **data** is the object provided via the call to render in yourSite.js.
- **templates/login.ejs** is an embedded JavaScript file. It has access to all the properties of the object provided though the login.js callback. Here it has access to message, but also to username and password.

Usage Scenario 2 - Output to a callback
=======================================

This example works well on both, server- and client-side.


Source
------

youScript.js

```javascript
var renderCallback = function (string) {
  console.log('The rendered output is:');
  console.log(string);

}
var mytpl = mute(renderCallback, '/templates', '/templates');

mytpl.render(
  'something',
  {
    input1: 'Something to display in the template site.',
    input2: 'Something to process by the template script.'
  }
);
```

templates/something.js

```javascript
muteScript('something', function (render, data) {
  doCoolStuff(data.input2);
  render(data);
});
```

template/something.ejs

```html
<h1>Some site</h1>
<h2>A message</h2>
<p><%= input1 %></p>
<h2>Processed data</h2>
<p><%= input2 %></p>
```

Explanation
-----------

As in the first scenario, the template is rendered. But instead of filling the inner HTML of a given selector (e.g. 'div[role="main"]' in scenario 1), the callback is invoked with the rendered string.