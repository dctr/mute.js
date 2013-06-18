Mute.js
=======

Mute.js is a **m**inimalistic, **u**nderscore.js-based **t**emplate **e**ngine that is small and simple but yet comfortable.

Currently, mute.js only features client-side usage and registers a global variable called *mute*. Support for node.js and require.js will be added later.

Key features:

1. **Uses underscore.js's _.template() function**

    Underscore.js is wiedely used and part of many projects anyway. Thus, mute.js does not add unnecessary overhead.

2. **Uses EJS template language**

    The *embedded JavaScript* template language consists of a few simple additions to plain HTML and can embed plain JavaScript. Thus, you do not need to learn any extra language, like with Jade.

3. **Adds convenience**

    Mute.js wraps the powerful functionality of underscore.js' template function in a simple-to-use interface.

4. **Adds include functionality**

    Underscore.js' template function lacks the ability to include one template from another. Mute.js adds an <% include templateName %>-tag.

5. **Async template loading with caching**

    Mute.js loads needed templates asynchronously and caches already used ones to save traffic.


Why?
====

I developed mute.js for two reasons:

1. I consider EJS the best template language, because it is simple and you do not need to learn any extra languages, for which you would need to know HTML and JavaScript anyway (KISS).
2. Existing solutions did not satisfy my needs.
  - http://embeddedjs.com/ completely lacks documentation and is not that actively developed.
  - Underscore.js' template function lacks convenience.


Install
=======

Mute.js uses underscore.js, therefore, if not already present, you just have to load underscore.js.


Short documentation
===================

mute()
------

Mute.js exposes a global mute function. Create a template engine instance by invoking it like follows.

```javascript
var muteInstance = mute(ejsDir, jsDir, target);
```

* **ejsDir** is the path to the files containing the EJS (default: '/templates').
* **jsDir** is the path to the JS files preprocessing the data (default: '/templates').
* **target** (optional) is the selector for an HTML element on the page, whichs content shall be replaced by the renderer, if provided.

muteInstance.render()
---------------------

To render a template in a given instance, do the folloging.

```javascript
muteInstance.render(tplName, tplArgs, callback, callbackArgs...);
```

* **tplName** is the name of the template and corresponds to ejsDir/tplName.ejs and jsDir/tplName.js.
* **tplArgs** is an object given to the preprocessing JS script.
* **callback** is the function that is called when rendering is finished
* **callbackArgs...** are any number of further arguments forwarded to the callback

callback()
----------

The render callback should have the following signature.

```javascript
var renderCallback = function (err, renderedHTML, callbackArgs...)
```

Where callbackArgs are any number of additional parameters provided to render().

template.js
-----------

A template boilerplate might be the following.

```javascript
muteScript('templatename', function (render, tplArgs) {
  'use strict';

  var templateData = {};

  // Process input from tplArgs object.
  // ==================================
  //
  // Store all data that should be available in the template in templateData.


  // Render the template with some data object.
  // ==========================================
  //
  // If this script is called, the template and this function are fetched.
  // Thus, the call to render() is sync.
  render(templateData);


  // Operate on the rendered site.
  // =============================
  //
  // After this point, you can operate on the rendered site, e.g. register
  // event handlers or manipulate the DOM.
});
```

template.ejs
------------

This is a sample EJS (HTML + JavaScript) document.

```html
<h1><%= pageHeading %></h1>
<ul>
  <% for (var i = 0; i < someItems.length; i++) { %>
  <li><%= someItems[i] %></li>
  <% } %>
</ul>
```

pageHeading was templateData.pageHeading in template.js, someItems where templateData.someItems accordingly.

As you can see, you can use regular JavaScript which's access to variables is limited to the ones provided through the template's JS file.


Usage Scenario
==============

Some source and explanation for a client-side usage scenario.

Source
------

yourSite.html

```html
<!doctype html>
<meta charset="utf-8">
<script src="underscore.js"></script>
<script src="mute.js"></script>
<script src="yourSite.js"></script>
<title>My cool site</title>
<form action="?" id="js-login">
  <input type="text" name="username" placeholder="Username" autofocus>
  <input type="password" name="password" placeholder="Password">
  <input type="submit" value="Login">
</form>
<div role="main">
</div>
```

yourSite.js (my example is using jQuery)

```javascript
var mytpl = mute('/templates', '/templates', 'div[role="main"]');

var readyLogger = function (err, html, foo, bar) {
  console.log('Rendering completed.');
  console.log('Error: ' + err);
  console.log('Rendered HTML: ' + html);
  console.log('Mute.js can forward ' + foo + bar);
}

$('#js-login input[type="submit"]').click = function (e) {
  e.preventDefault();
  mytpl.render(
    'login',
    {
      username: $('#js-login input[name="username"]').val(),
      password: $('#js-login input[name="password"]').val()
    },
    readyLogger,
    'any number of ',
    'additional parameters!'
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
- **yourSite.js** is you regular site-managing JavaScript. Here, an event handler for the submit button in the login form of the HTML page is defined. If the submit button is clicked, the form data is submitted to mute.js' render function. The callback is invoked after completion and logs the results to console.
- **templates/login.js** contains all code to process the given information.
  - **render** is the callback function that has to be called with an object, which's properties should be available in the template.
  - **data** is the object provided via the call to render in yourSite.js.
- **templates/login.ejs** is an embedded JavaScript file. It has access to all the properties of the object provided though the login.js callback. Here it has access to message, but also to username and password.


Thanks
======

Thanks to Jesse Jiryu Davis (@ajdavis) for his article on including functionality for underscore.js.

Thanks to Juraj Vitko (@ypocat) for his code on parallel async functions.