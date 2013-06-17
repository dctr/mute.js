(function () {
  'use strict';

  var myfunc = function (err, res, cbArgs) {
    console.log('RENDER READY CALLBACK');
    console.log('=====================');
    console.log('ERROR:');
    console.log(err);
    console.log('RESULT');
    console.log(res);
    console.log('CB ARGS');
    console.log(cbArgs);
  };

  var mymute = mute('/tpl', '/tpl', 'div[role="main"]');
  mymute.render(
    'sometpl',
    {date1: 'value1', date2: 'value2'},
    myfunc,
    {chosen: 'sometpl'}
  );
  // mymute.render(
  //   'nonexistent',
  //   {foo: 'bar'},
  //   myfunc,
  //   {chosen: 'nonexistent'}
  // );
}());