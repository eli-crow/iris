import Panel from './Panel.js';
import Group from './Group.js';
import TabbedView from './TabbedView.js';
import BrushPreview from './BrushPreview.js';

export default class BrushPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-brush.pug'));

		this._inputsElement = this._element.querySelector('.iris-input-group');
		this._previewCanvas = this._element.querySelector('.brush-preview');
		this._brushInputTabs = new Group(this._inputsElement);

		this.brushPreview = new BrushPreview(this._previewCanvas);
	}

	setBrush(brush) {
		this.brushPreview.setBrush(brush);
		this._brushInputTabs
			.empty()
			.add(new TabbedView()
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