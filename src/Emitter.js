//class for dispatching events to attached handlers.
class EmitterEvent 
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

module.exports = class Emitter
{
	constructor(eventNames) {
		if (eventNames) {
			this.events = {};
			for (var i = 0, ii = eventNames.length; i < ii; i++) {
				var eventName = eventNames[i];
				this.events[eventName] = new EmitterEvent(eventName);
			}
		}
	}
	
	emit(eventName, eventArgs){
		var callbacks = this.events[eventName].callbacks;
		for (var i = 0, ii = callbacks.length; i < ii; i++) {
			var callback = callbacks[i];
			if (callback) callback(eventArgs);
			else callbacks.splice(1, 1);
		}
		return this;
	}
	
	on(eventName, callback){
		if (!Array.isArray(eventName)) eventName = [eventName];
		for (var i = 0, ii = eventName.length; i < ii; i++) {
			try {
				this.events[eventName[i]].attachCallback(callback);
			}
			catch (e) {
				console.warn(`Event "${eventName[i]}" not registered.`);
				break;
			}
		}

		return this;
	}
	
	off(eventName, callback){
		if (eventName.constructor === Array) {
			for (var i = 0, ii = eventName.length; i < ii; i++) {
				this.events[eventName[i]].detachCallback(callback);
			}
		}
		else this.events[eventName].detachCallback(callback);

		return this;
	}
}