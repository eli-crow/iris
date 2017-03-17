const Panel = require('./Panel.js');
const Iris = require('./Iris.js');
const mathutils = require('./mathutils.js');

module.exports = class IrisPanel extends Panel
{
	constructor () {
		super(null, require('../templates/panel-iris.pug'));

		this._wheel = this._element.querySelector('.iris-wheel');
		this._indicator = this._element.querySelector('.iris-indicator');
		this._modes = this._element.querySelector('.iris-modes');
		this._inputs = this._element.querySelector('.iris-input-group');

		this.iris = new Iris(this._wheel);
		this.iris.on(['pick', 'pickend'], rgbArr => this.setIndicatorColor(rgbArr));
		this.iris.setMode('Colors');

		//init
		const lightnessSlider = new Panel.Slider(77, 0, 100, 1/255)
			.classes('lightness')
			.bind(this.iris.palettes['Colors'].uniforms, "lightness")
			.on('change', () => this.iris.emitColors('pickend', null, false));
		const hueSlider = new Panel.Slider(0, 0, 360, 1)
			.classes('hue')
			.bind(this.iris.palettes['Tones'].uniforms, "hue")
			.on('change', () => this.iris.emitColors('pickend', null, false))
			.transform(x => x/180*Math.PI)
			.hide();
		const inputs = new Panel.Group(this._inputs)
			.add(lightnessSlider)
			.add(hueSlider);

		//TODO: refactor into iris.
		this._lightnessSlider = lightnessSlider;

		const setMode = (name, slider, button) => {
			this.iris.setMode(name);
			slider.unhide();
			button._element.style.borderTopColor = '';
			inputs.each(slider, input => input.hide() );
			modeButtonGroup.each(button, btn => btn._element.style.borderTopColor = 'transparent');
		}

		const sameLightnessButton = new Panel.Button('Colors')
			.class('iris-tab')
			.unclass('iris-button')
			.bind(() => setMode("Colors", lightnessSlider, sameLightnessButton));
		const sameHueButton = new Panel.Button('Shades')
			.class('iris-tab')
			.unclass('iris-button')
			.bind(() => setMode("Tones", hueSlider, sameHueButton));
		const modeButtonGroup = new Panel.ButtonGroup()
			.add(sameLightnessButton)
			.add(sameHueButton);

		const modes = new Panel.Group(this._modes)
			.add(modeButtonGroup);
	}

	setIndicatorColor(rgbArr) {
		this._indicator.style.backgroundColor = `rgba(${rgbArr.slice(0,3).join(',')}, 1)`;
	}

	setColorData(data) {
		const iris = this.iris;
		iris._highlight.movePolarNormal(-1 * mathutils.radians(data.hsl[0]), data.hsl[1]/100);
		iris.palettes['Colors'].uniforms.lightness = data.hsl[2];
		this.setIndicatorColor(data.rgba);
		this._lightnessSlider._input.value = data.hsl[2]
	}

	onResize() {
		this.iris.onResize();
		this.iris.setMode('Colors');
		this.iris.emitColors('pick', null, null, false);
	}
}