const Emitter = require('./Emitter.js');
const SmoothPointer = require('./SmoothPointer.js');

module.exports = class Tool extends Emitter {
	constructor (surface, options) {
		super(['change', 'changeend']);

		this._effectors = [];
		this._smoothedEffectors = [];
		this._surface = surface;
		this._currentCtx = surface.ctx;

		this.pointer = new SmoothPointer(surface.canvas, {
		  minDistance: 2,
		  steps: 2,
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

	set (prop, val) {
	  this[prop] = val;
	  this.emit('changeend');
	}

	setSurface (surface) {
		this._surface = surface;
		this._currentCtx = surface.ctx;
	}

	addEffector (effectors, isSmoothedEffector) {
		for (let i = 0, ii = effectors.length; i < ii; i++) {
			const effector = effectors[i];
			effector.tool = this;

			if (effector.type in this.EffectorTypes) 
				effector.targetProp = this.EffectorTypes[effector.type];

			if (isSmoothedEffector) 
				this._smoothedEffectors.push(effector);
			else
				this._effectors.push(effector);
		}
	}

	applyEffectors(effectorGroup, event, props) {
		const result = JSON.parse(JSON.stringify(props));

	  for (let i = 0, ii = effectorGroup.length; i < ii; i++) {
	  	const effector = effectorGroup[i];
	    result[effector.targetProp] = Math.max(0,
	    	result[effector.targetProp] + effector.transform(this, event)
	    );
	  };

	  return result;
	}
};