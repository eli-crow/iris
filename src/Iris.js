const IrisPalette = require('./IrisPalette.js');
const Reactor = require('./Reactor.js');
const fnutils = require('./fnutils.js');
const glutils = require('./glutils.js');
const domutils = require('./domutils.js');
const listenerutils = require('./listenerutils.js')

const WEBGL_CONTEXT = "webgl";
const PUPIL_RADIUS = 0.25;
const HILIGHT_RADIUS = 7.5;
const passthrough = require('../shaders/vert/passthrough.vert');
const sameLightness = require('../shaders/frag/same_lightness.frag');
const sameHue = require('../shaders/frag/same_hue.frag');

//manages the canvas and its own IrisPalettes.
class Iris
{
	constructor (canvas) {
		this._gl = canvas.getContext(WEBGL_CONTEXT, {
			preserveDrawingBuffer: true,
			depth: false,
			antialias: false,
			premultipliedAlpha: true,
			alpha: true
		});
		this._canvas = canvas;
		this._currentPalette = null;

		const reactor = this._reactor = new Reactor(['pick', 'pickend']);
		this.on  = reactor.addEventListener.bind(reactor);
		this.off = reactor.removeEventListener.bind(reactor);
		
		const pupil = this._pupil = document.createElement('div');
		pupil.classList.add('picker-pupil');
		canvas.insertAdjacentElement('afterend', pupil);

		const highlight = this._highlight = document.createElement('div');
		highlight.classList.add('picker-hilight');
		highlight.style.width  = HILIGHT_RADIUS * 2 + 'px';
		highlight.style.height = HILIGHT_RADIUS * 2 + 'px';
		canvas.insertAdjacentElement('afterend', this._highlight);

		this.palettes = {};
		this.palettes['sameLightness'] =
			new IrisPalette('Colors', this._gl, sameLightness, passthrough, {
				lightness: {type: '1f', value: 50},
				indicator_radius: {type: '1f', value: PUPIL_RADIUS}
			});
		this.palettes['sameHue'] = 
			new IrisPalette('Tones', this._gl, sameHue, passthrough, {
				hue: {type: '1f', value: 0},
				indicator_radius: {type: '1f', value: PUPIL_RADIUS}
			});

		this.onResize();
		this.setMode('sameLightness');

		listenerutils.normalPointer(canvas, {
			contained: false,
			down: e => this.dispatchColors('pick', e, true), 
			move: e => this.dispatchColors('pick', e, true),
			up:   e => this.dispatchColors('pickend', e, false)
		});
	}

	dispatchColors (eventName, e, updateHilight) {
		const angle = Math.atan2(e.normY, e.normX);
		const dist = Math.sqrt(Math.pow(e.centerX,  2) + Math.pow(e.centerY, 2));
		
		const c = glutils.getPixel(this._canvas, e.relX, e.relY);
		if (c[3] >= 255) 
			this._reactor.dispatchEvent(eventName, c); //if alpha == 1
		if (updateHilight) 
			domutils.setVendorCss(this._highlight, 'transform', `translate3d(${e.relX}px,${e.relY}px, 0px)`);
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

		const ps  = this._pupil.style;
		const pw  = PUPIL_RADIUS * width;
		const ph  = PUPIL_RADIUS * height;
		ps.left   = (width/2 + canvas.offsetLeft - pw/2) + 'px';
		ps.top    = (height/2 + canvas.offsetTop - ph/2) + 'px';
		ps.width  = pw + 'px';
		ps.height = ph + 'px';
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}
}

module.exports = Iris;