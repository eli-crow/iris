//class for dispatching events to attached handlers.
function ReactorEvent (name) {
	this.name = name;
	this.callbacks = [];
}
ReactorEvent.prototype.attachCallback = function (callback) {
	this.callbacks.push(callback);
}
ReactorEvent.prototype.detachCallback = function (callback) {
	this.callbacks.splice(callback, 1);
}

function Reactor (eventNames) {
	this.events = {};
	for (var i = 0, ii = eventNames.length; i < ii; i++) {
		var eventName = eventNames[i];
		this.events[eventName] = new ReactorEvent(eventName);
	}
}
Reactor.prototype.dispatchEvent = function(eventName, eventArgs){
	var callbacks = this.events[eventName].callbacks;
  for (var i = 0, ii = callbacks.length; i < ii; i++) {
  	var callback = callbacks[i];
  	if (callback) callback(eventArgs);
  	else callbacks.splice(1, 1);
  }
};
Reactor.prototype.addEventListener = function(eventName, callback){
  this.events[eventName].attachCallback(callback);
  return callback;
};
Reactor.prototype.removeEventListener = function(eventName, callback){
  this.events[eventName].detachCallback(callback);
};

module.exports = Reactor;