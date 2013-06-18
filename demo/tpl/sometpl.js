muteScript('sometpl', function (render, data) {
  console.log('MUTE SCRIPT');
  console.log('===========');
  console.log('DATA');
  console.log(data);
  render(data);
});