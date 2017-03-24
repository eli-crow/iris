//todo: consider moving to pub/sub for application events.

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
	
	emit(eventNames, eventArgs){
		if (!Array.isArray(eventNames)) eventNames = [eventNames];
		for (var i = 0, ii = eventNames.length; i < ii; i++) {
			const callbacks = this.events[eventNames[i]].callbacks;

			for (let j = 0, jj = callbacks.length; j < jj; j++) {
				const callback = callbacks[j];

				if (callback) callback(eventArgs);
				else callbacks.splice(j, 1);
			}
		}
		return this;
	}
	
	on(eventNames, callback){
		if (!Array.isArray(eventNames)) eventNames = [eventNames];
		for (var i = 0, ii = eventNames.length; i < ii; i++) {
			try {
				this.events[eventNames[i]].attachCallback(callback);
			}
			catch (e) {
				console.warn(`Event "${eventNames[i]}" not registered.`);
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