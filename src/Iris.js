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
		this.setMode('sameHue');



		const hueSlider = new Slider(0, 0, 360, 1)
			.bind(this.palettes['sameHue'].uniforms, "hue")
			.transform(x => x/180*Math.PI);

		const inputs = new PanelGroup(inputContainer);
		inputs.add(hueSlider);
	}

	onResize() {
		const canvas = this._canvas;
		const cs = window.getComputedStyle(canvas);
		const width = parseInt(cs.width);
		const height = parseInt(cs.height);
		for(let name in this.palettes) {
			this.palettes[name].uniforms['resolution'] = [width, height];
		}
		canvas.width = width;
		canvas.height = height;
		this._gl.viewport(0,0, width, height);

		const ps = this._pupil.style;
		const pw = INDICATOR_RADIUS * width;
		const ph = INDICATOR_RADIUS * height;
		console.log(canvas.offsetLeft);
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