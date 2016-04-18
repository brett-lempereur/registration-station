/**
 * Client for the registration station event stream.
 */

// Event stream endpoint.
const EVENTS = 'ws://localhost:1880/ws/events';

/**
 * Listen for websocket events and setup handlers.
 */
function onReady() {

  // Connect to the event stream and handle events.
  var socket = new WebSocket(EVENTS);
  socket.onmessage = function (msg) {
    if (msg.data === 'removed') {
      tagRemoved();
    } else {
      tagPresent(msg.data);
    }
  };
  socket.onerror = function (msg) {
    console.log('Event stream failed: ' + msg);
  };

  // Register keyboard and submission handlers.
  registerSubmit();

}

/**
 * Handle a tag being presented.
 */
function tagPresent(identity) {
  $('input[name=userId]').val(identity);
  $('html, body').animate({ scrollTop: $('#registration').offset().top }, 1000);
}

/**
 * Handle a tag being removed.
 */
function tagRemoved() {
  $('input[name=userId]').val('');
  $('html, body').animate({ scrollTop: $('#welcome').offset().top }, 1000);
  clearRegistration();
}

/**
 * Clear the contents of the registration form.
 */
function clearRegistration() {
  $('input[name=userId]').val('');
  $('input[name=name]').val('');
  $('input[name=twitter]').val('');
  $('input[name=consent]').val(true);
}

/**
 * Registration submission handler.
 */
function registerSubmit() {

  $('#register').submit(function () {
    console.log('Registering: ' + $('#register').serialize());
    $.ajax({
      type: 'post',
      url: '/register',
      data: $('#register').serialize(),

      success: function (response) {
        console.log('Successful registration: ' + response);
        clearRegistration();
        $(window).scrollTo($('#success'), { duration: 600, onAfter: blurAll });
      },

      failure: function (response) {
        console.log('Failed registration: ' + response);
        $(window).scrollTo($('#error'), { duration: 600, onAfter: blurAll });
      },
    });
    return false;
  });

}

// Register the page-load code.
window.onload = onReady;
