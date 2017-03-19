const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');
const mathutils = require('./mathutils.js');
const Panel = require('./Panel.js');

module.exports = class Brush extends TexturedTool
{
	constructor(options) {
		super(['draw'], options);

		this._properties.size = {min: 0, max: 10, value: 4, map: x => x*x};
		this._properties.flow = {min: 0.3, max: 1, value: 1};
		this._properties.angle = {min: 0, max: 360, value: 135, map: x => mathutils.radians(x)};
		this._dirty = true;
		
		this.erase = false;
	}

	drawPoints (surface, e, pts) {
		const props = Brush.applyEffectors(this._effectors, e, this._getBaseProps());

		for (let i = 0, ii = pts.length; i<ii; i+= 2) {
			e.penPressure = mathutils.lerp(i/ii, e.penPressure, e.lastPressure);
			e.squaredSpeed = mathutils.lerp(i/ii, e.squaredSpeed, e.lastSquaredSpeed);
			this.draw(surface, pts[i], pts[i+1], Brush.applyEffectors(this._smoothedEffectors, e, props));
		}
	}

	draw (surface, x, y, props) {
		const size = Math.max(0, props.size);
		let width = size, height = size;

		if (this._sizeRatio < 1) {
			width = this._sizeRatio * size;
		} else {
			height = 1/this._sizeRatio * size;
		}

		canvasutils.drawTexture (
			surface.ctx, this._texture,
			x - surface.position[0], y - surface.position[1],
			width, height,
			props.angle,
			Math.max(0, props.flow),
			this.erase
		);
	}

	onDown (surface, e) { 
		super.onDown(surface, e);

		this.draw(surface, e.relX, e.relY, 
			Brush.applyEffectors(this._effectors, e, this._getBaseProps())
		); 
		this.emit('draw');
	}

	onMove (surface, e) {
		super.onDown(surface, e);

		this.drawPoints(surface, e, e.pts); 
		this.emit('draw');
	}

	onUp (surface, e) {
		super.onDown(surface, e);
	}

	setErase (bool) {
		this.erase = bool;

		return this;
	}

	getInputs() {
		if (this._inputs) {
			return this._inputs;
		}
		
		const inputs = super.getInputs();

		inputs.base.push(new Panel.Spacer());
		inputs.base.push(new Panel.Toggle('Erase', this.erase)
			.bind(isToggled => {
				console.log(isToggled);
				this.erase = isToggled;
				this.emit('changeend');
			})
		);

		return inputs;
	}
}

module.exports.prototype.EffectorTypes = {
	size: 'size',
	flow: 'flow',
	angle: 'angle'
}