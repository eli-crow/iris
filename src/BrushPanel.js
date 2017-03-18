const Panel = require('./Panel.js');
const BrushPreview = require('./BrushPreview.js');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-brush.pug'));

		this._inputsElement = this._element.querySelector('.iris-input-group');
		this._preview = this._element.querySelector('.brush-preview');
		this._brushInputTabs = new Panel.Group(this._inputsElement);

		this.brushPreview = new BrushPreview(this._preview);
	}

	setBrush(brush) {
		this.brushPreview.setBrush(brush);

		this._brushInputTabs
			.empty()
			.add(new Panel.TabbedView()
				.addGroup(brush.getInputs())
				.init()
			);
	}

	onResize() {
		this.brushPreview.onResize();
		this.draw();
	}

	draw () {
		this.brushPreview.draw();
	}
}