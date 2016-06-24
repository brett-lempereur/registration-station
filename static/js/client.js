/**
 * Client for the registration station event stream.
 */

// Event stream endpoint.
const EVENTS = 'ws://localhost:1880/ws/events';

// Animations.
const SPEED = 1000;

// Input keyboard navigation.
var inputs = ['input[name=name]', 'input[name=twitter]'];
var currentInput = null;

/**
 * Listen for websocket events and setup handlers.
 */
function onReady() {

  // Connect to the event stream and handle events.
  var socket = new ReconnectingWebSocket(EVENTS);
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
  registerKeyboardEvents();
  registerSubmit();

}

/**
 * Handle a tag being presented.
 */
function tagPresent(identity) {
  $('input[name=userId]').val(identity);
  $('html, body').animate({ scrollTop: $('#registration').offset().top }, SPEED);
  setTimeout(function () {
    $('input[name=name]').focus();
  }, SPEED);
}

/**
 * Handle a tag being removed.
 */
function tagRemoved() {
  $('input[name=userId]').val('');
  $('html, body').animate({ scrollTop: $('#welcome').offset().top }, SPEED);
  clearRegistration();
}

/**
 * Clear the contents of the registration form.
 */
function clearRegistration() {
  currentInput = null;
  $('input[name=userId]').val('');
  $('input[name=name]').val('');
  $('input[name=twitter]').val('');
  $('input[name=consent]').val(false);
  document.activeElement.blur();
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
        $('html, body').animate({ scrollTop: $('#success').offset().top }, SPEED);
      },

      failure: function (response) {
        console.log('Failed registration: ' + response);
        $('html, body').animate({ scrollTop: $('#error').offset().top }, SPEED);
      },
    });
    return false;
  });

}

/**
 * Keyboard event handler.
 */
function registerKeyboardEvents() {
  $(document).keydown(function (e) {

    // Ignore page navigation keys.
    switch (e.which) {
    case 33: // Page up.
      break;
    case 34: // Page down.
      break;
    case 35: // End
      break;
    case 36: // Home
      break;
    case 38: // Up arrow.
      moveInput(-1);
      break;
    case 40: // Down arrow.
      moveInput(1);
      break;
    default: // Defer to the parent handler.
      return;
    }

    // Prevent default croll or caret move events.
    e.preventDefault();

  });
}

/**
 * Handle moving between keyboard inputs.
 */
function moveInput(direction) {

  if ($('input[name=userId]').val() === '') {
    return;
  }

  if (currentInput == null) {
    currentInput = 0;
  } else {
    target = currentInput + direction;
    if (target >= 0 && target < inputs.length) {
      currentInput = target;
    }
  }

  $(inputs[currentInput]).focus();

}

// Register the page-load code.
window.onload = onReady;
