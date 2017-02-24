const Brush = require('./Brush.js');

module.exports = class BrushEffector
{
	constructor (effectorType, transform) {
		this.targetProp = (effectorType in Brush.EffectorTypes) ?
			Brush.EffectorTypes[effectorType] : null;
		this.scale = 1;
		this._transform = transform || null;
	}

	transform(brushProps, event) {
		return (this.scale === 0) ? 0 : (this._transform(brushProps, event) * this.scale);
	}

	set (prop, val) {
	  this[prop] = val;
	  this.tool.dispatch('changeend');
	}
}