const Tool = require('./Tool.js');

const mathutils = require('./mathutils.js');

module.exports = class SurfaceMover extends Tool
{
	constructor () {
		super(['move']);
		this._lastPos = null;
	}

	onDown (surface, e) {
		this._lastPos = [e.relX, e.relY];
	}

	onMove (surface, e) {
		const diff = mathutils.vSub([e.relX, e.relY], this._lastPos);
		surface.position = mathutils.vAdd(surface.position, diff);

		this.emit('move');
		this._lastPos = [e.relX, e.relY];
	}

	onUp (surface, e) {
		this._lastPos = null;
	}
}