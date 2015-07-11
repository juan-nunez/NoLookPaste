angular.module('app',[]);


chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 350,
      height: 250
    },
    resizable:false
  });
});