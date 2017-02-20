const IrisPalette = require('./IrisPalette.js');
const fnutils = require('./fnutils.js');
const glutils = require('./glutils.js');
const listenerutils = require('./listenerutils.js');

const WEBGL_CONTEXT = "webgl";
const INDICATOR_RADIUS = 0.25;
const passthrough = require('../shaders/vert/passthrough.vert');

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas) {
		const self = this;

		self._gl = canvas.getContext(WEBGL_CONTEXT, {preserveDrawingBuffer: true});
		self._canvas = canvas;
		
		self._pupil = document.createElement('div');
		self._pupil.classList.add('pupil');
		self._canvas.insertAdjacentElement('afterend', self._pupil);

		self.palettes = {};
		self.palettes['sameLightness'] =
			new IrisPalette('Different Hues', self._gl, require('../shaders/frag/same_lightness.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		self.palettes['sameHue'] = 
			new IrisPalette('Same Hue', self._gl, require('../shaders/frag/same_hue.frag'), passthrough, {
				hue: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		self._currentPalette = null;

		self.onResize();
		self.setMode('sameHue');

		listenerutils.normalPointer(canvas, {
			contained: true,
			down: function (e) {

			}, 
			move: function (e) {
				const p = glutils.getPixel(self._canvas, e.relX, e.relY);
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