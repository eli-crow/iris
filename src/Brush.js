const TexturedTool = require('./TexturedTool.js');
const canvasutils = require('./canvasutils.js');

module.exports = class Brush extends TexturedTool
{
	constructor(surface, options) {
		super(surface, options);
		
		this.minSize = 2;
		this.erase = false;
		this.minFlow = 0;
		this.pressureSensitivity = 0;
		this.angleSensitivity = 15;
		this.speedSensitivity = 0;
		this.speedScale = 200;
		this.calligAngle = 135;
		this.hasSymmetricalEmphasis = false;
	}

	draw (ctx, e, pts) {
		if (e.altKey) return;

		const props = this.applyEffectors(this._effectors, e, { size: this.minSize, flow: this.minFlow });

		for (let i = 0, ii = pts.length; i<ii; i+= 2) {
			const smoothProps = this.applyEffectors(this._smoothedEffectors, e, props);

			canvasutils.drawTexture(
				ctx, this._texture,
				pts[i], pts[i + 1],
				smoothProps.size, smoothProps.size,
				2 * Math.PI * Math.random(),
				smoothProps.flow
			);
		}
	}

	onDown (ctx, e) { this.draw(ctx, e, [e.offsetX, e.offsetY]); }
	onMove (ctx, e) { this.draw(ctx, e, e.pts); }
	onUp (ctx, e) {}
}

module.exports.prototype.EffectorTypes = {
	size: 'size',
	flow: 'flow'
}