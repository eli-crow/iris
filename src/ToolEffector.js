const Slider = require('./Slider.js');
const strutils = require('./strutils.js');

module.exports = class ToolEffector
{
	constructor (tool, name, effectorType, val, min, max, transform) {
		this.scale = 1;
		this.type = effectorType;
		this.targetProp = null;

		this._transform = transform || null;

		if (min != null && max != null) {
			this._input = new Slider(val, min, max, 0.01, strutils.titleCase(name))
				.bind(val => {
					this.scale = val;
					tool.emit('changeend');
				});
		}
	}

	transform(brushProps, event) {
		return (this.scale === 0) ? 0 : (this._transform(brushProps, event) * this.scale);
	}

	getInputs () {
		return this._input;
	}
}