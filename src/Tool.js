const Reactor = require('./Reactor.js');
const SmoothPointer = require('./SmoothPointer.js');

module.exports = class Tool {
	constructor (surface, options) {
		this._effectors = [];
		this._smoothedEffectors = [];
		this._reactor = new Reactor(['change', 'changeend']);
		this._surface = surface;
		this._currentCtx = surface.ctx;

		this.pointer = new SmoothPointer(surface.canvas, {
		  minDistance: 2,
		  steps: 30,
		  smoothedProps: options['smoothInputs'],
		  smoothing: 0.35,

		  down: e => this.onDown(this._currentCtx, e),
		  move: e => this.onMove(this._currentCtx, e),
		  up:   e => this.onUp(this._currentCtx, e)
		});
	}

	// should be implemented by children
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

	set (prop, val) {
	  this[prop] = val;
	  this._reactor.dispatchEvent('changeend');
	}

	setSurface (surface) {
		this._surface = surface;
		this._currentCtx = surface.ctx;
	}

	_addEffector (effectorGroup, effectors) {
		for (var i = 0, ii = effectors.length; i < ii; i++) {
			const effector = effectors[i];
			effector.tool = this;

			if (effector.type in this.constructor.EffectorTypes) 
				effector.targetProp = this.constructor.EffectorTypes[effector.type];

			effectorGroup.push(effector);
		}
	}

	addEffector (effectors) {
		this._addEffector(this._effectors, arguments);
	}

	addSmoothEffector (effectors) {
		this._addEffector(this._smoothedEffectors, arguments);
	}


	getEffectorSum(effectorGroup, event) {
	  let sum = 0;
	  for (let i = 0, ii = effectorGroup.length; i < ii; i++) {
	    sum += effectorGroup[i].transform(this, event);
	  };
	  return sum;
	}
};