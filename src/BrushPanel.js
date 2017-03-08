const Panel = require('./Panel.js');
const BrushPreview = require('./BrushPreview.js');

const __template = require('../templates/panel-brush.pug');

module.exports = class BrushPanel extends Panel
{
	constructor () {
		super();

		const tempEl = document.createElement('div');
		tempEl.insertAdjacentHTML('beforeend', __template());
		const element = tempEl.children[0];

		this._inputsElement = element.querySelector('.iris-input-group');
		this._preview = element.querySelector('.brush-preview');
		this._element = element;

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