const Panel = require('./Panel.js');
const BrushPreview = require('./BrushPreview.js');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-brush.pug'));

		this._inputsElement = this._element.querySelector('.iris-input-group');
		this._preview = this._element.querySelector('.brush-preview');

		this.brushPreview = new BrushPreview(this._preview);
	}

	setBrush(brush) {
		this.brushPreview.setBrush(brush);

		const inputs = brush.getInputs();

		if (this._brushInputTabs)
			this._brushInputTabs.remove();
		this._brushInputTabs = new Panel.Group(this._inputsElement)
			.add(new Panel.TabbedView()
				.addGroup(inputs)
				.init()
			);
	}

	onResize() {
		this.brushPreview.onResize();
		this.brushPreview.draw();
	}
}