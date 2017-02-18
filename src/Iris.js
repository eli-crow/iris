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

		this.setMode('differentHue');

		const lightness = new Slider(0, 1, 1/255).bind(this._currentPalette.uniforms, "lightness");

		const inputs = new PanelGroup(inputContainer);
		inputs.add(lightness);
	}

	onResize() {
		const cs = window.getComputedStyle(this._canvas);
		for(let name in this.palettes) {
			palettes[name].setUniform('resolution', [cs.width, cs.height]);
		}
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}
}

module.exports = Iris;