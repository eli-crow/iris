const Group = require('./Group.js');
const Slider = require('./Slider.js');
const PanelElement = require('./PanelElement.js');
const listenerutils = require('./listenerutils.js');

module.exports = class ToolShapeSelector extends Group
{
	constructor(urls) {
		super(null, null, ['change', 'changeend', 'load']);
		this.classes('brush-shape-selector', 'iris-input');

		this._urls = urls;
		this._ratio = 
		this._shape = {
			img: null,
			brushSrc: null,
			ratio: 1
		}

		//init
		let imagesLoaded = 0;
		for (var i = 0, ii = this._urls.length; i < ii; i++) {
			const img = new Image();
			const pe = new PanelElement([], img)
				.classes('brush-shape-preview');

			img.onload = () => {
				this.add(pe);
				if (++imagesLoaded >= urls.length) {
					this._shape.img = img;
					this._shape.brushSrc = this._urls[0];
					this.emit('load', this._shape);
				}
			}
			pe._element.onclick = () => {
				this._shape.img = img;
				this._shape.brushSrc = img.src;
				this.emit('changeend', this._shape);
			}

			this._shape.img = img;
			this._shape.brushSrc = img.src;
			img.src = this._urls[i];
		}

		listenerutils.mouseWheel(this._element, {
			preventDefault: true,
			handler: e => this._element.scrollLeft += e.delta / 2
		});
	}

	getInputs () {
		return new Slider(0, -1, 1, .01, 'Ratio')
			.map(x => Math.pow(10, x))
			.bind(val => {
				this._shape.ratio = window.parseFloat(val);
				this.emit('changeend', this._shape);
			});
	}
}