const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');
const mathutils = require('./mathutils.js');

module.exports = class Brush extends TexturedTool
{
	constructor(surface, options) {
		super(surface, options);
		
		this.erase = false;
		this.minSize = 1;
		this.minFlow = 0;
		this.baseRatio = .8;
		this.calligAngle = 135;
		this.hasSymmetricalEmphasis = false;
	}

	drawPoints (ctx, e, pts) {
		if (e.downButton === 2 || e.altKey) return;
		const props = Brush.applyEffectors(this._effectors, e, this._getBaseProps());

		for (let i = 0, ii = pts.length; i<ii; i+= 2) {
			e.penPressure = mathutils.lerp(i/ii, e.penPressure, e.lastPressure);
			this.draw(ctx, pts[i], pts[i+1], Brush.applyEffectors(this._smoothedEffectors, e, props));
		}
	}

	draw (ctx, x, y, props) {
		canvasutils.drawTexture(
			ctx, this._texture,
			x, y,
			props.size * props.sizeRatio, props.size,
			props.angle,
			props.flow,
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
			size: this.minSize, 
			flow: this.minFlow,
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