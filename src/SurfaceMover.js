import Tool from './Tool.js';

import * as mathutils from './mathutils.js';

export default class SurfaceMover extends Tool
{
	constructor () {
		super(['move', 'moveend']);
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
		surface.needsResizing = true;
		this._lastPos = null;
	}
}