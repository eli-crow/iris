const IrisPalette = require('./IrisPalette.js');

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

		this.setMode('differentHue');
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