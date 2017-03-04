const IrisPalette = require('./IrisPalette.js');
const Highlight = require('./Highlight.js');
const Pupil = require('./Pupil.js');
const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');

const __scrollAdjustSpeed = 0.2;
const __webglConfig = {
	preserveDrawingBuffer: true,
	depth: false,
	antialias: false,
	premultipliedAlpha: true,
	alpha: true
};

//manages the canvas and its own IrisPalettes.
module.exports = class Iris extends Emitter
{
	constructor (canvas, indicator) {
		super(['pick', 'pickend', 'zoom']);

		this._canvas = canvas;
		this._gl = canvas.getContext('webgl', __webglConfig) || canvas.getContext('experimental-webgl', __webglConfig);
		this._currentPalette = null;
		this._pupil = new Pupil(canvas);
		this._highlight = new Highlight(canvas, this._gl);
		this.palettes = {};

		this.init();
	}

	init () {
		const pupil = this._pupil;
		const highlight = this._highlight;

		listenerutils.normalPointer(this._canvas, {
			contained: true,
			down: e => this.emitColors('pick', e.centerX, e.centerY, true), 
			move: e => this.emitColors('pick', e.centerX, e.centerY, true),
			up:   e => this.emitColors('pickend', e.centerX, e.centerY, false),
		});

		listenerutils.mouseWheel(this._canvas, {
			preventDefault: true,
			debounce: { wait: 100, immediate: false,
				handler: () => this.emitColors('pickend', null, null, false),
			},
			handler: e => {
				this._highlight.adjustPolar(0, -e.delta * __scrollAdjustSpeed);
				this.emitColors('pick', null, null, false);
			}
		});

		this.addPalette('Colors A', require('../shaders/frag/same_lightness.frag'),     {lightness: {type: '1f', value: 50}});
		this.addPalette('Colors B', require('../shaders/frag/same_lightness_hsl.frag'), {lightness: {type: '1f', value: .5}});
		this.addPalette('Tones',    require('../shaders/frag/same_hue.frag'),           {hue: {type: '1f', value: 0}});

		pupil.on('huerotate', e =>	{
			highlight.movePolar(Math.PI/2 - e.getAngle(), highlight.getDistance());
			this.emitColors('pick', null, null, false);
		});
		pupil.on('huerotateend', e => this.emitColors('pickend', null, null, false));
		pupil.on('center', e => {
			highlight.move(0,0);
			this.emitColors('pickend', null, null, false);
		});

		this.onResize();
		this.setMode('Colors A');
	}

	addPalette (name, fragShader, uniforms) {
		const ip = new IrisPalette(this, fragShader, require('../shaders/vert/passthrough.vert'), uniforms);
		ip.on('uniformupdated', () => this.emitColors('pick', null, false));
		this.palettes[name] = ip;
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
			palette.uniforms['resolution'] = [width, height];
		}
		canvas.width = width;
		canvas.height = height;
		this._gl.viewport(0,0, width, height);

		this._pupil.resize();
	}

	setColor(lchArr) {
		this._currentPalette.getPositionFromLch(lchArr);
	}

	setMode (modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}

	getInputs () {
		const inputs = [];

		for (var i = 0, ii = this.palettes.length; i < ii; i++) {
			inputs.push(this.palettes[i].getInputs());
		}

		return inputs;
	}
}