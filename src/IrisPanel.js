const Panel = require('./Panel.js');
const Iris = require('./Iris.js');
const mathutils = require('./mathutils.js');

// todo: refactor inputs into iris.getinputs() <- irispalette.getinputs() so
// irispalette can bind sliders and configure internally.

module.exports = class IrisPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-iris.pug'));

		this._wheel = this._element.querySelector('.iris-wheel');
		this._indicator = this._element.querySelector('.iris-indicator');
		this._modes = this._element.querySelector('.iris-modes');
		this._inputs = this._element.querySelector('.iris-input-group');

		this.iris = new Iris(this._wheel);

		// init
		this.iris.on(['pick', 'pickend'], rgbArr => this.setIndicatorColor(rgbArr));
		this.iris.setMode('Colors B');

		const ins = this.iris.getInputs();
		const inputs = new Panel.Group(this._inputs)
			.add(ins);
	}

	setIndicatorColor(rgbArr) {
		this._indicator.style.backgroundColor = `rgba(${[rgbArr[0], rgbArr[1], rgbArr[2]].join(',')}, 1)`;
	}

	setColorData(data) {
		const iris = this.iris;
		iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);

		const cpu = iris.currentPalette.uniforms;
		if (cpu.lightness) cpu.lightness = data.hsl[2];

		this.setIndicatorColor(data.rgba);
		this._lightnessSlider.setValue(data.hsl[2]);
	}

	onResize() {
		this.iris.onResize();
		this.iris.setMode('Colors B');
		this.iris.emitColors('pick', null, null, false);
	}
}