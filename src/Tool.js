const Emitter = require('./Emitter.js');
const Slider = require('./Slider.js');
const ToolEffector = require('./ToolEffector.js');

const strutils = require('./strutils.js');
const fnutils = require('./fnutils.js');

//abstract
module.exports = class Tool extends Emitter 
{
	constructor (events, options) {
		super(['change', 'changeend'].concat(events));

		this._effectors = [];
		this._smoothedEffectors = [];
		this._properties = {};
		this._baseProps = null;
		this._inputs = null;
	}

	onDown (surface, e) {} //abstract
	onMove (surface, e) {
		e.preventDefault();
	}
	onUp (surface, e) {}   //abstract

	addEffector (name, effectorType, val, min, max, fn, isSmoothedEffector, group) {
		const effector = new ToolEffector(this, name, effectorType, val, min, max, fn, isSmoothedEffector);
		if (group) {
			effector.group = group;
		}

		if (effector.type in this.EffectorTypes) {
			effector.targetProp = this.EffectorTypes[effector.type];
		} else {
			console.warn(effector.type + 'is not supported by this tool')
			return this;
		}

		if (isSmoothedEffector) {
			this._smoothedEffectors.push(effector);
		} else{
			this._effectors.push(effector);
		}

		return this;
	}

	addEffectorGroup (name, effectorArgsArray) {
		for (let i = 0, ii = effectorArgsArray.length; i < ii; i++) {
			const args = effectorArgsArray[i];
			args.push(name);
			this.addEffector.apply(this, args);
		}

		return this;
	}

	getInputs () {
		if (this._inputs) {
			return this._inputs;
		}

		const inputs = {
			base: [],
		};

		// base property sliders
		for (let name in this._properties) {
			const prop = this._properties[name];

			const slider = new Slider(prop.value, prop.min, prop.max, 0.005, strutils.titleCase(name));
			if (fnutils.isFunction(prop.map))
				slider.map(prop.map);
			slider.bind(val => {
				this._properties[name].value = +val;
				this._dirty = true;
				this.emit('changeend');
			});

			inputs.base.push(slider);
		}

		// then effector sliders
		const effectors = this._effectors.concat(this._smoothedEffectors);
		for (let i = 0, ii = effectors.length; i < ii; i++) {
			const e = effectors[i];
			if (e.group) {
				if (!Array.isArray(inputs[e.group]))
					inputs[e.group] = [];
				inputs[e.group].push(e.getInputs());
			}
			else {
				inputs.base.push(e.getInputs());
			}
		}

		this._inputs = inputs;
		
		return inputs;
	}

	_getBaseProps () {
		if (this._dirty) {
			this._baseProps = {};
			for (let name in this._properties) {
				this._baseProps[name] = this._properties[name].value;
			}
			this._dirty = false; 
		}
		return this._baseProps;
	}

	static applyEffectors(effectorGroup, event, props) {
		const result = JSON.parse(JSON.stringify(props));
		const evt = JSON.parse(JSON.stringify(event));

	  for (let i = 0, ii = effectorGroup.length; i < ii; i++) {
	  	const effector = effectorGroup[i];
	    result[effector.targetProp] =
	    	result[effector.targetProp] + effector.transform(evt);
	  };

	  return result;
	}
};