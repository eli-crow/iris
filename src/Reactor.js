//class for dispatching events to attached handlers.
class ReactorEvent 
{
	constructor(name) {
		this.name = name;
		this.callbacks = [];
	}
	attachCallback (callback) {
		this.callbacks.push(callback);
	}
	detachCallback (callback) {
		this.callbacks.splice(callback, 1);
	}
}

class Reactor
{
	constructor(eventNames) {
		this.events = {};
		for (var i = 0, ii = eventNames.length; i < ii; i++) {
			var eventName = eventNames[i];
			this.events[eventName] = new ReactorEvent(eventName);
		}
	}
	dispatchEvent(eventName, eventArgs){
		var callbacks = this.events[eventName].callbacks;
		for (var i = 0, ii = callbacks.length; i < ii; i++) {
			var callback = callbacks[i];
			if (callback) callback(eventArgs);
			else callbacks.splice(1, 1);
		}
	}
	addEventListener(eventName, callback){
		this.events[eventName].attachCallback(callback);
		return callback;
	}
	removeEventListener(eventName, callback){
		this.events[eventName].detachCallback(callback);
	}
}


module.exports = Reactor;