/*jslint browser: true, evil: true, indent: 2, nomen: true, todo: true */
/*global _, console */

/**
 * Mute - Minimal Underscore.js-based Template Engine
 *
 * A caching, client-side template engine based on Underscore's template().
 * This script exports the engine to a browsers global mute object.
 * TODO: Error Callback
 */
(function (modulename) {
  'use strict';

  var constructor, cachedScripts, cachedTemplates;


  // -----
  // Private Static
  // ----------

  cachedScripts = {};
  cachedTemplates = {};

  /**
   * Function to export as global mute object
   *
   * This is a function creating a template engine instance for a certain CSS selector.
   * It is enrichted by "static" functions below.
   * @param  {string} ejsDir  URL path which contains the EJS files.
   * @param  {string} jsDir   URL path which contains the JS files.
   * @param  {string} target  A CSS selector defining the Element which's content should be replaced by a template. Can be empty if rendered output should only provided through the callback of render().
   * @return {object}         A mute instance for the CSS selector.
   */
  constructor = function (spec) {
    var that, cache, ejsDir, jsDir, muteScript, preprocessTemplate, redirects, renderCompiledTemplate;

    // -----
    // Validate input
    // ----------

    // NICETOHAVE: Check input for /^[A-Za-z0-9\/]*$/

    ejsDir = spec.ejsDir || '/templates';
    jsDir = spec.jsDir || '/templates';

    cachedScripts[jsDir] = {};
    cachedTemplates[ejsDir] = {};


    // -----
    // Private non-static
    // ----------
    // TODO: Make history (use browser's pushState for back/forth buttons).

    redirects = {};

    cache = function (spec, callback, callbackArguments) {
      var err, reqTpl, reqScr, template;

      template = spec.template;

      if (cachedTemplates[ejsDir][template]) {
        callback(undefined, callbackArguments);
        return;
      }

      err = new Error('Failed to load template "' + template + '".');

      reqTpl = new XMLHttpRequest();
      reqTpl.open('GET', ejsDir + '/' + template + '.ejs');
      reqTpl.onload = function (e) {
        // NOTE: A 304 from the server results in a client-side 200.
        if (this.status !== 200) {
          callback(err, callbackArguments);
        }
        cachedTemplates[ejsDir][template] = _.template(
          // TODO: This is async!!
          preprocessTemplate(
            {ejs: this.response},
            callback,
            callbackArguments
          )
        );
        reqScr = new XMLHttpRequest();
        reqScr.open('GET', jsDir + '/' + template + '.js');
        reqScr.onload = function (e) {
          // NOTE: A 304 from the server results in a client-side 200.
          if (this.status !== 200) {
            callback(err, callbackArguments);
          }
          eval(this.response.trim() + ';');
          // NOTE: No need to cache the script, as it calls muteScript() itself.
        };
        reqScr.send();
      };
      reqTpl.send();
    };

    /**
     * Cache a script with a given name
     * @param  {string}   template The name of the template.
     * @param  {function} script   The function to be executed on template execution.
     */
    muteScript = function (template, script) {
      // NICETOHAVE: Check input for /^[A-Za-z0-9]*$/
      if (cachedScripts[jsDir][template]) { return; }
      cachedScripts[jsDir][template] = script;
    };

    preprocessTemplate = function (spec, callback, callbackArguments) {
      var ejs = spec.ejs;
      callback(
        ejs.replace(
          /<%\s*include\s*(.*?)\s*%>/g,
          function (matchedText, template) {
            cache(template);
            return cachedTemplates[ejsDir][template];
          }
        ),
        callbackArguments
      );
    };

    // Compiles memoized templates.
    renderCompiledTemplate = function (err, spec, callback, callbackData) {
      if (err) { callback(err, undefined, callbackData); }
      cachedScripts[jsDir][spec.template](
        spec.data,
        function (processedData, cb, cbData) {
          var html = cachedTemplates[ejsDir][spec.template](processedData);
          if (spec.target) {
            document.querySelector(spec.target).innerHTML = html;
          }
          cb(undefined, html, cbData);
          callback(undefined, html, callbackData);
        }
      );
    };


    that = {};

    /**
     * Render a template
     * @param  {string}   template           Template name (also filename without extension).
     * @param  {object}   data               A data object which will be present within the corresponding script and the template.
     * @param  {function} callback           A function to call, when rendering is done. fn(err, res, cbArgs)
     * @param  {object}   callbackArguments  An object to provide to the callback as additional parameter
     */
    that.render = function (spec, callback, callbackArguments) {
      // NICETOHAVE: Check input for /^[A-Za-z0-9]*$/
      callback = callback || function () {};
      spec.template = redirects[spec.template] || spec.template;
      cache(
        spec,
        renderCompiledTemplate,
        spec
      );
    };

    /**
     * Sets an alias for a certain template
     * @param  {string} source The templates name.
     * @param  {string} target Which template should be displayed instead
     */
    that.setRedirect = function (source, target) {
      // NICETOHAVE: Check input for /^[A-Za-z0-9]*$/
      redirects[source] = target;
    };

    return that;
  };

  /**
   * Convert <br>, <br/>, and <br /> to \n
   * @param  {string} str The source string.
   * @return {string}     The processed string
   */
  constructor.br2nl = function (str) {
    if (typeof str !== 'string') { return str; }
    return str.replace(/<br\s*\/?>/mg, '\n');
  };

  /**
   * Clear the template and script cache
   *
   * Usefull, if the templates/scripts change server-side.
   */
  constructor.clear = function () {
    cachedScripts = {};
    cachedTemplates = {};
  };

  /**
   * Convert \n to <br />
   *
   * Using self-closing br tag to be compatible with both HTML5 _and_ XHTML.
   * @param  {string} str The source string.
   * @return {string}     The processed string
   */
  constructor.nl2br = function (str) {
    if (typeof str !== 'string') { return str; }
    var breakTag = '<br />';
    return str.replace(
      /(\r\n|\n\r|\r|\n)/mg,
      breakTag + '$1'
    );
  };

  /**
   * Export the global mute object.
   */
  window[modulename] = constructor;
}('mute'));