module.exports = class ToolEffector
{
	constructor (effectorType, transform) {
		this._transform = transform || null;
		this.scale = 1;
		this.type = effectorType;
		this.targetProp = null;
	}

	transform(brushProps, event) {
		return (this.scale === 0) ? 0 : (this._transform(brushProps, event) * this.scale);
	}

	set (prop, val) {
	  this[prop] = val;
	  this.tool.emit('changeend');
	}
}