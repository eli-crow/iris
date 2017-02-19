const IrisPalette = require('./IrisPalette.js');
const Slider = require('./Slider.js');
const PanelGroup = require('./PanelGroup.js');

const WEBGL_CONTEXT = "webgl";

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas, inputContainer) {
		this.palettes = {};
		this._currentPalette = null;
		this._canvas = canvas;
		this._gl = canvas.getContext(WEBGL_CONTEXT);

		const passthrough = require('../shaders/vert/passthrough.vert');
		this.palettes['differentHue'] =
			new IrisPalette(this._gl, require('../shaders/frag/differentHue.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5}
			});
		this.palettes['sameHue'] = 
			new IrisPalette(this._gl, require('../shaders/frag/sameHue.frag'), passthrough, {
				hue: {type: '1f', value: 0.5}
			});

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
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}
}

module.exports = Iris;