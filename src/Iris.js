const IrisPalette = require('./IrisPalette.js');
const Reactor = require('./Reactor.js');
const fnutils = require('./fnutils.js');
const glutils = require('./glutils.js');
const listenerutils = require('./listenerutils.js')

const WEBGL_CONTEXT = "webgl";
const INDICATOR_RADIUS = 0.25;
const passthrough = require('../shaders/vert/passthrough.vert');

//manages the canvas and manages its IrisPalettes.
class Iris
{
	constructor (canvas) {
		const self = this;

		self.palettes = {};
		self._gl = canvas.getContext(WEBGL_CONTEXT, {preserveDrawingBuffer: true});
		self._canvas = canvas;
		self._currentPalette = null;

		const reactor = self._reactor = new Reactor(['pick', 'pickend']);
		self.on  = reactor.addEventListener.bind(reactor);
		self.off = reactor.removeEventListener.bind(reactor);
		
		self._pupil = document.createElement('div');
		self._pupil.classList.add('picker-pupil');
		canvas.insertAdjacentElement('afterend', self._pupil);

		self._highlight = document.createElement('div');
		self._highlight.classList.add('picker-hilight');
		canvas.insertAdjacentElement('afterend', self._highlight);

		self.palettes['sameLightness'] =
			new IrisPalette('Colors', self._gl, require('../shaders/frag/same_lightness.frag'), passthrough, {
				lightness: {type: '1f', value: 0.5},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});
		self.palettes['sameHue'] = 
			new IrisPalette('Tones', self._gl, require('../shaders/frag/same_hue.frag'), passthrough, {
				hue: {type: '1f', value: 0},
				indicator_radius: {type: '1f', value: INDICATOR_RADIUS}
			});

		self.onResize();
		self.setMode('sameLightness');

		self._pupil.addEventListener('click', () => {
			reactor.dispatchEvent('pick', glutils.getPixel(canvas, canvas.width/2, canvas.height/2))
		});

		function dispatchColors (event, e) {
			const c = glutils.getPixel(canvas, e.relX, e.relY);
			if (c[3] === 1) reactor.dispatchEvent(event, c);
		}
		listenerutils.normalPointer(canvas, {
			contained: true,
			down: e => dispatchColors('pick', e), 
			move: e => dispatchColors('pick', e),
			up:   e => dispatchColors('pickend', e)
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