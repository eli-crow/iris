const IrisPalette = require('./IrisPalette.js');
const Highlight = require('./Highlight.js');
const Pupil = require('./Pupil.js');
const Emitter = require('./Emitter.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js')

const PUPIL_RADIUS = 0.25;
const WEBGL_CONTEXT = "webgl";
const passthrough = require('../shaders/vert/passthrough.vert');
const sameLightness = require('../shaders/frag/same_lightness.frag');
const sameHue = require('../shaders/frag/same_hue.frag');

//manages the canvas and its own IrisPalettes.
class Iris extends Emitter
{
	constructor (canvas) {
		super(['pick', 'pickend']);

		this._canvas = canvas;
		this._gl = canvas.getContext(WEBGL_CONTEXT, {
			preserveDrawingBuffer: true,
			depth: false,
			antialias: false,
			premultipliedAlpha: true,
			alpha: true
		});
		
		const highlight = this._highlight = new Highlight(canvas);
		this._pupil = new Pupil(canvas);
		this._pupil.on('drag', e =>	{
			highlight.movePolar(-e.getAngle() + Math.PI/2, highlight.getDistance());
			this.emitColors('pick', null, false);
		});
		this._pupil.on('release', e => {
			highlight.movePolar(-e.getAngle() + Math.PI/2, highlight.getDistance());
			this.emitColors('pickend', null, false);
		});
		
		this._currentPalette = null;
		this.palettes = {};
		this.palettes['sameLightness'] = new IrisPalette(this, 'Colors', sameLightness, passthrough, {
			lightness: {type: '1f', value: 50},
			indicator_radius: {type: '1f', value: PUPIL_RADIUS}
		});
		this.palettes['sameHue'] = new IrisPalette(this, 'Tones', sameHue, passthrough, {
			hue: {type: '1f', value: 0},
			indicator_radius: {type: '1f', value: PUPIL_RADIUS}
		});

		this.onResize();
		this.setMode('sameLightness');

		listenerutils.normalPointer(canvas, {
			contained: false,
			down: e => this.emitColors('pick', e.centerX, e.centerY, true), 
			move: e => this.emitColors('pick', e.centerX, e.centerY, true),
			up:   e => this.emitColors('pickend', e.centerX, e.centerY, true),
		});
	}

	emitColors (eventName, x, y, updateHilight) {
		if (updateHilight) this._highlight.move(x, y);
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

		this._pupil.resize();
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}
}

module.exports = Iris;