const Slider = require('./Slider.js');
const strutils = require('./strutils.js');

module.exports = class ToolEffector
{
	constructor (name, effectorType, transform) {
		this.name = name;
		this.scale = 1;
		this.type = effectorType;
		this.targetProp = null;

		this._transform = transform || null;
	}

	transform(brushProps, event) {
		return (this.scale === 0) ? 0 : (this._transform(brushProps, event) * this.scale);
	}

	getInputs () {
		return new Slider(0, -50, 50, 0.1, strutils.titleCase(this.name)).bind(val => {
			this.scale = val;
			this.tool.emit('changeend');
		});
	}
}