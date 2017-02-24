const Reactor = require('./Reactor.js');

module.exports = class Tool {
	constructor () {
		this._effectors = [];
		this._smoothedEffectors = [];
		this._reactor = new Reactor(['change', 'changeend']);
	}
	onDown () {}
	onMove () {}
	onUp () {}

	on (eventname, callback) { 
	  this._reactor.addEventListener.call(this._reactor, eventname, callback); 
	}
	off (eventname, callback) { 
	  this._reactor.addEventListener.call(this._reactor, eventname, callback); 
	}
	dispatch (eventname, args) {
		this._reactor.dispatchEvent(eventname, args);
	}

	addEffector (effectors, shouldInterpolate) {
		for (var i = 0, ii = effectors.length; i < ii; i++) {
			const effector = effectors[i];
			effector.tool = this;
			if (shouldInterpolate) this._smoothedEffectors.push(effector);
			else this._effectors.push(effector);
		}
	}
};