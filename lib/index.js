function EventSync () {
  this.eventArgs = {};
  this.eventCallbacks = {};
}

EventSync.prototype.open = function (eventName) {
  if (arguments.length < 1) {
    throw new Error('event name is required');
  }

  if (typeof eventName !== 'string') {
    throw new Error('event name must be a string');
  }

  var callbackArgs = Array.prototype.slice.call(arguments, 1);

  if (this.eventArgs.hasOwnProperty(eventName)) {
    return;
  }

  this.eventArgs[eventName] = callbackArgs;

  if (this.eventCallbacks.hasOwnProperty(eventName)) {
    var callbacks = this.eventCallbacks[eventName];
    for (var i = 0; i < callbacks.length; ++i) {
      callbacks[i].apply(this, callbackArgs);
    }
  }
};

EventSync.prototype.close = function (eventName) {
  if (arguments.length < 1) {
    throw new Error('event name is required');
  }

  if (typeof eventName !== 'string') {
    throw new Error('event name must be a string');
  }

  delete this.eventArgs[eventName];
};

EventSync.prototype.once = function (eventName, callback) {
  if (arguments.length < 2) {
    throw new Error('event name and callback function are required');
  }

  if (typeof eventName !== 'string') {
    throw new Error('event name must be a string');
  }

  if (typeof callback !== 'function') {
    throw new Error('callback function must be a function');
  }

  this.sync(eventName, callback);
  this.sync(eventName, function remove () {
    this.unsync(eventName, callback);
    this.unsync(eventName, remove);
  }.bind(this));
};

EventSync.prototype.sync = function (eventName, callback) {
  if (arguments.length < 2) {
    throw new Error('event name and callback function are required');
  }

  if (typeof eventName !== 'string') {
    throw new Error('event name must be a string');
  }

  if (typeof callback !== 'function') {
    throw new Error('callback function must be a function');
  }

  if (!this.eventCallbacks.hasOwnProperty(eventName)) {
    this.eventCallbacks[eventName] = [];
  }

  this.eventCallbacks[eventName].push(callback);

  if (this.eventArgs.hasOwnProperty(eventName)) {
    callback.apply(this, this.eventArgs[eventName]);
  }
};

EventSync.prototype.unsync = function (eventName, callback) {
  if (arguments.length < 2) {
    throw new Error('event name and callback function are required');
  }
  if (typeof eventName !== 'string') {
    throw new Error('event name must be a string');
  }

  if (typeof callback !== 'function') {
    throw new Error('callback function must be a function');
  }

  if (!this.eventCallbacks.hasOwnProperty(eventName)) {
    return;
  }
  
  var eventList = this.eventCallbacks[eventName];
  
  for (var i = 0; i < eventList.length; ++i) {
    if (eventList[i] === callback) {
      eventList.splice(i, 1);
    }
  }

  if (eventList.length === 0) {
    delete this.eventCallbacks[eventName];
  }
};

module.exports = EventSync;