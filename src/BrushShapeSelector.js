const Group = require('./Group.js');
const PanelElement = require('./PanelElement.js');

module.exports = class BrushShapeSelector extends Group
{
	constructor(urls) {
		super(null, null, ['change', 'changeend']);
		this.classes('brush-shape-selector');
		this._urls = urls;

		//init
		for (var i = 0, ii = this._urls.length; i < ii; i++) {
			const img = new Image();
			const pe = new PanelElement([], img)
				.classes('brush-shape-preview');
			img.onload = () => this.add(pe);
			pe._element.onclick = () => this.emit('changeend', {img, brushSrc: img.src});
			img.src = this._urls[i];
		}
	}
}