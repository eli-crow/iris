const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');
const mathutils = require('./mathutils.js');

module.exports = class Brush extends TexturedTool
{
	constructor(surface, options) {
		super(surface, options);
		
		this.erase = false;
		this.baseSize = 1;
		this.baseFlow = 0;
		this.baseRatio = .8;
		this.calligAngle = 135;
		this.hasSymmetricalEmphasis = false;
	}

	drawPoints (ctx, e, pts) {
		if (e.downButton === 2 || e.altKey) return;
		const props = Brush.applyEffectors(this._effectors, e, this._getBaseProps());

		for (let i = 0, ii = pts.length; i<ii; i+= 2) {
			e.penPressure = mathutils.lerp(i/ii, e.penPressure, e.lastPressure);
			e.squaredSpeed = mathutils.lerp(i/ii, e.squaredSpeed, e.lastSquaredSpeed);
			this.draw(ctx, pts[i], pts[i+1], Brush.applyEffectors(this._smoothedEffectors, e, props));
		}
	}

	draw (ctx, x, y, props) {
		const size = Math.max(0, props.size);
		canvasutils.drawTexture(
			ctx, this._texture,
			x, y,
			size * props.sizeRatio, size,
			props.angle,
			Math.max(0, props.flow),
			this.erase
		);
	}

	onDown (ctx, e) { 
		this.draw(ctx, e.offsetX, e.offsetY, 
			Brush.applyEffectors(this._effectors, e, this._getBaseProps())
		); 
	}

	onMove (ctx, e) { 
		this.drawPoints(ctx, e, e.pts); 
	}

	onUp (ctx, e) {}


	_getBaseProps () {
		return { 
			size: this.baseSize, 
			flow: this.baseFlow,
			sizeRatio: this.baseRatio,
			angle: 0
		}
	}
}

module.exports.prototype.EffectorTypes = {
	size: 'size',
	flow: 'flow',
	angle: 'angle'
}