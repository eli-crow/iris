const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');
const mathutils = require('./mathutils.js');
const Panel = require('./Panel.js');

module.exports = class Brush extends TexturedTool
{
	constructor(options) {
		super(options);

		this._properties.size = {min: 0, max: 5, value: 3, map: x => Math.exp(x)};
		this._properties.flow = {min: 0, max: 1, value: 1};
		this._properties.angle = {min: 0, max: 360, value: 135, map: x => mathutils.radians(x)};
		this._dirty = true;
		
		this.erase = false;
	}

	drawPoints (ctx, e, pts) {
		const props = Brush.applyEffectors(this._effectors, e, this._getBaseProps());

		for (let i = 0, ii = pts.length; i<ii; i+= 2) {
			e.penPressure = mathutils.lerp(i/ii, e.penPressure, e.lastPressure);
			e.squaredSpeed = mathutils.lerp(i/ii, e.squaredSpeed, e.lastSquaredSpeed);
			this.draw(ctx, pts[i], pts[i+1], Brush.applyEffectors(this._smoothedEffectors, e, props));
		}
	}

	draw (ctx, x, y, props) {
		const size = Math.max(0, props.size);
		let width = size, height = size;

		if (this._sizeRatio < 1) {
			width = this._sizeRatio * size;
		} else {
			height = 1/this._sizeRatio * size;
		}

		canvasutils.drawTexture (
			ctx, this._texture,
			x, y, width, height,
			props.angle,
			Math.max(0, props.flow),
			this.erase
		);
	}

	onDown (surface, e) { 
		this.draw(surface.ctx, e.offsetX, e.offsetY, 
			Brush.applyEffectors(this._effectors, e, this._getBaseProps())
		); 
	}

	onMove (surface, e) { 
		this.drawPoints(surface.ctx, e, e.pts); 
	}

	onUp (ctx, e) {}

	getInputs() {
		const inputs = super.getInputs();

		inputs.base.push(new Panel.Spacer());
		inputs.base.push(new Panel.Toggle('Erase', false)
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