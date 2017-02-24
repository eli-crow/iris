module.exports = class ToolEffector
{
	constructor (effectorType, transform) {
		this.scale = 1;
		this.type = effectorType;
		this.targetProp = null;
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