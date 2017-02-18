const IrisPalette = require('./IrisPalette');

const WEBGL_CONTEXT = "webgl";

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas) {
		this._canvas = canvas;
		const gl = this._gl = canvas.getContext(WEBGL_CONTEXT);

		const passthrough = require('../shaders/vert/passthrough.vert');
		this.palettes = {};
		this.palettes['differentHue'] =
			new IrisPalette(gl, require('../shaders/frag/differentHue.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5}
			});
		this.palettes['sameHue'] = 
			new IrisPalette(gl, require('../shaders/frag/sameHue.frag'), passthrough, {
				hue: {type: '1f', value: 0.5}
			});

		this._currentPalette = this.palettes.differentHue;
		this._currentPalette.draw();
	}

	onResize() {
		const cs = window.getComputedStyle(this._canvas);
		for(let name in palettes) {
			palettes[name].setUniform('resolution', [cs.width, cs.height]);
		}
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
	}
}

module.exports = Iris;