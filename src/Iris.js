const IrisPalette = require('./IrisPalette.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js');

const WEBGL_CONTEXT = "webgl";
const INDICATOR_RADIUS = 0.25;
const passthrough = require('../shaders/vert/passthrough.vert');

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas) {
		this._gl = canvas.getContext(WEBGL_CONTEXT);
		this._canvas = canvas;
		
		this._pupil = document.createElement('div');
		this._pupil.classList.add('pupil');
		this._canvas.insertAdjacentElement('afterend', this._pupil);

		this.palettes = {};
		this.palettes['sameLightness'] =
			new IrisPalette('Same Lightness', this._gl, require('../shaders/frag/same_lightness.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		this.palettes['sameHue'] = 
			new IrisPalette('Same Hue', this._gl, require('../shaders/frag/same_hue.frag'), passthrough, {
				hue: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		this._currentPalette = null;

		this.onResize();
		this.setMode('sameHue');

		listenerutils.normalPointer(canvas, {
			down: function (e) {

			}, 
			move: function (e) {

			},
			up: function (e) {

			}
		});
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