const IrisPalette = require('./IrisPalette.js');
const Slider = require('./Slider.js');
const PanelGroup = require('./PanelGroup.js');

const WEBGL_CONTEXT = "webgl";
const INDICATOR_RADIUS = 0.25;

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas, inputContainer) {
		this.palettes = {};
		this._currentPalette = null;
		this._canvas = canvas;
		this._gl = canvas.getContext(WEBGL_CONTEXT);

		const passthrough = require('../shaders/vert/passthrough.vert');
		this.palettes['sameLightness'] =
			new IrisPalette(this._gl, require('../shaders/frag/same_lightness.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		this.palettes['sameHue'] = 
			new IrisPalette(this._gl, require('../shaders/frag/same_hue.frag'), passthrough, {
				hue: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});

		this._pupil = document.createElement('div');
		this._pupil.classList.add('pupil');
		this._canvas.insertAdjacentElement('afterend', this._pupil);

		this.onResize();
		this.setMode('sameLightness');

		const lightnessSlider = new Slider(0.5, 0, 1, 1/255)
			.classes('lightness')
			.bind(this.palettes['sameLightness'].uniforms, "lightness")
			.transform(x => x*1.17 - 0.17);

		const hueSlider = new Slider(0, 0, 360, 1)
			.classes('hue')
			.bind(this.palettes['sameHue'].uniforms, "hue")
			.transform(x => x/180*Math.PI);

		const inputs = new PanelGroup(inputContainer);
		inputs.add(lightnessSlider);
		inputs.add(hueSlider);
	}

	onResize() {
		const canvas = this._canvas;
		const cs = window.getComputedStyle(canvas);
		const width = parseInt(cs.width);
		const height = parseInt(cs.height);
		for(let name in this.palettes) {
			const palette = this.palettes[name];
			palette.use();
			palette.uniforms['resolution'] = [width, height];
		}
		canvas.width = width;
		canvas.height = height;
		this._gl.viewport(0,0, width, height);

		const ps = this._pupil.style;
		const pw = INDICATOR_RADIUS * width;
		const ph = INDICATOR_RADIUS * height;
		ps.left = (width/2 + canvas.offsetLeft - pw/2) + 'px';
		ps.top = (height/2 + canvas.offsetTop - ph/2) + 'px';
		ps.width = pw + 'px';
		ps.height = ph + 'px';
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}
}

module.exports = Iris;