const IrisPalette = require('./IrisPalette.js');
const Highlight = require('./Highlight.js');
const Pupil = require('./Pupil.js');
const Emitter = require('./Emitter.js');
const TabbedView = require('./TabbedView.js');

const listenerutils = require('./listenerutils.js');
const mathutils = require('./mathutils.js');

const __palettes = require('./palettes.js');
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
	constructor (canvas) {
		super(['pick', 'pickend', 'zoom']);

		this._canvas = canvas;
		this._gl = canvas.getContext('webgl', __webglConfig) || canvas.getContext('experimental-webgl', __webglConfig);
		this._currentPalette = null;
		this._pupil = new Pupil(canvas);
		this._highlight = new Highlight(canvas, this._gl);
		this._inputs = null;
		this.palettes = {};

		//init
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

		for (var i = 0, ii = __palettes.length; i < ii; i++) {
			const spec = __palettes[i];
			if (spec.enabled) {
		 		this.addPalette(spec);
		 	}
		}

		this.setMode('Colors');

		this._pupil.on('huerotate', e => {
			this._highlight.movePolar(Math.PI/2 - e.getAngle(), this._highlight.getDistance());
			this.emitColors('pick', null, null, false);
		});
		this._pupil.on('huerotateend', e => this.emitColors('pickend', null, null, false));
		this._pupil.on('center', e => {
			this._highlight.move(0,0);
			this.emitColors('pickend', null, null, false);
		});
	}

	addPalette (descriptor) {
		const ip = new IrisPalette(
			this, 
			descriptor.fragmentSource,
			require('../shaders/vert/passthrough.vert'), 
			descriptor.properties,
			descriptor.name
		);
		ip.on('uniformupdated', () => this.emitColors('pick', null, false));
		ip.on('inputchange', () => this.emitColors('pickend', null, false));
		this.palettes[descriptor.name] = ip;

		this._currentPalette = ip;
	}

	emitColors (eventName, x, y, updateHilight) {
		if (updateHilight) this._highlight.move(x, y);
		const c = this._highlight.sample();

		//if alpha == 1
		if (c[3] >= 255) {
			this.emit(eventName, c); 
		}
	}

	onResize() {
		const canvas = this._canvas;
		const cs = window.getComputedStyle(canvas);
		const width = parseInt(cs.width);
		const height = parseInt(cs.height);

		for(let name in this.palettes) {
			this.palettes[name].resize(width, height);
		}
		canvas.width = width;
		canvas.height = height;
		this._gl.viewport(0,0, width, height);

		this._highlight.move(0,0);
		this._pupil.resize();
		this._currentPalette.draw();
	}

	setColor(lchArr) {
		this._currentPalette.getPositionFromLch(lchArr);
	}

	setMode(modeName) {
		this._currentPalette = this.palettes[modeName];
		this._currentPalette.activate();
		this._currentPalette.draw();
	}

	get currentPalette () { return this._currentPalette }

	getInputs() {
		const tv = new TabbedView(null, {style: 'manual'});
		const tabs = {};

		for (let name in this.palettes) {
			const p = this.palettes[name];
			const ins = p.getInputs();

			tv.add(p.name, ins, {
				onSwitch: () => this.setMode(name) 
			});
			tabs[p.name] = ins;
		}

		this._inputs = tv;
		return tv;
	}
};