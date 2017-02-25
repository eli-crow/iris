const IrisPalette = require('./IrisPalette.js');
const Highlight = require('./Highlight.js');
const Emitter = require('./Emitter.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js')

const WEBGL_CONTEXT = "webgl";
const PUPIL_RADIUS = 0.25;
const passthrough = require('../shaders/vert/passthrough.vert');
const sameLightness = require('../shaders/frag/same_lightness.frag');
const sameHue = require('../shaders/frag/same_hue.frag');

//manages the canvas and its own IrisPalettes.
class Iris extends Emitter
{
	constructor (canvas) {
		super(['pick', 'pickend']);

		this._gl = canvas.getContext(WEBGL_CONTEXT, {
			preserveDrawingBuffer: true,
			depth: false,
			antialias: false,
			premultipliedAlpha: true,
			alpha: true
		});
		this._canvas = canvas;
		this._currentPalette = null;
		this._highlight = new Highlight(canvas);
		this.palettes = {};
		this.palettes['sameLightness'] = new IrisPalette(this, 'Colors', sameLightness, passthrough, {
			lightness: {type: '1f', value: 50},
			indicator_radius: {type: '1f', value: PUPIL_RADIUS}
		});
		this.palettes['sameHue'] =  new IrisPalette(this, 'Tones', sameHue, passthrough, {
			hue: {type: '1f', value: 0},
			indicator_radius: {type: '1f', value: PUPIL_RADIUS}
		});

		const pupil = this._pupil = document.createElement('div');
		pupil.classList.add('iris-pupil');
		canvas.insertAdjacentElement('afterend', pupil);

		this.onResize();
		this._highlight.move(canvas.width/2, canvas.height/2);
		this.setMode('sameLightness');

		listenerutils.normalPointer(canvas, {
			contained: false,
			down: e => this.emitColors('pick', e, true), 
			move: e => this.emitColors('pick', e, true),
			up:   e => this.emitColors('pickend', e, true),
		});
	}

	emitColors (eventName, e, updateHilight) {
		if (updateHilight) this._highlight.move(e.relX, e.relY);
		const c = this._highlight.sample();
		if (c[3] >= 255) this.emit(eventName, c); //if alpha == 1
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