const Emitter = require('./Emitter.js');
const BrushShapeSelector = require('./BrushShapeSelector.js');

module.exports = class BrushEditor extends Emitter
{
	constructor () {
		super();

		this._brushes = [];
		this._currentBrush = null;
		this._selector = new BrushShapeSelector([
			'./img/brush.png',
			'./img/brush_smooth.png',
			'./img/brush_inky.png'
		]);
		this._selector.on('changeend', data => this._currentBrush.setShape(data.brushSrc));
	}

	addBrush(brush) {
		this._brushes.push(brush);
		this.setBrush(brush);
		return this;
	}

	setBrush(brush) {
		this._currentBrush = brush;
		return this;
	}
}