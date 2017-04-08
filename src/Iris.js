import IrisPalette from './IrisPalette.js';
import Highlight from './Highlight.js';
import Pupil from './Pupil.js';
import Emitter from './Emitter.js';
import TabbedView from './TabbedView.js';

import * as listenerutils from './listenerutils.js';
import * as omutils from './mathutils.js';
import * as domutils from './domutils.js';

import {palettes as __palettes} from './palettes.js';
const __scrollAdjustSpeed = 0.2;
const __webglConfig = {
	preserveDrawingBuffer: true,
	depth: false,
	antialias: false,
	premultipliedAlpha: true,
	alpha: true
};

//manages the canvas and its own IrisPalettes.
export default class Iris extends Emitter
{
	constructor () {
		super(['pick', 'pickend']);

		this._canvas = document.createElement('canvas');
		this._gl = this._canvas.getContext('webgl', __webglConfig) || this._canvas.getContext('experimental-webgl', __webglConfig);
		this._currentPalette = null;
		this._pupil = new Pupil(this._canvas);
		this._highlight = new Highlight(this._canvas, this._gl);
		this._inputs = null;
		this.palettes = {};

		//init
		this._canvas.classList.add('iris-wheel');

		listenerutils.normalPointer(this._canvas, {
			contained: true,
			down: e => this._emitColors('pick', e.centerX, e.centerY, true), 
			move: e => this._emitColors('pick', e.centerX, e.centerY, true),
			up:   e => this._emitColors('pickend', e.centerX, e.centerY, false),
		});

		listenerutils.mouseWheel(this._canvas, {
			preventDefault: true,
			debounce: { wait: 100, immediate: false,
				handler: () => this._emitColors('pickend', null, null, false),
			},
			handler: e => {
				this._highlight.adjustPolar(0, -e.delta * __scrollAdjustSpeed);
				this._emitColors('pick', null, null, false);
			}
		});

		__palettes.forEach(spec => {
			if (spec.enabled) {
		 		this.addPalette(spec);
		 	}
		})

		this.setMode('Colors');

		this._pupil.on('huerotate', e => {
			this._highlight.movePolar(Math.PI/2 - e.getAngle(), this._highlight.getDistance());
			this._emitColors('pick', null, null, false);
		});
		this._pupil.on('huerotateend', e => this._emitColors('pickend', null, null, false));
		this._pupil.on('center', e => {
			this._highlight.move(0,0);
			this._emitColors('pickend', null, null, false);
		});

		this._emitColors('pickend', null, null, false);
	}

	addPalette (descriptor) {
		const ip = new IrisPalette(
			this, 
			descriptor.fragmentSource,
			require('../shaders/vert/passthrough.vert'), 
			descriptor.properties,
			descriptor.name
		);
		ip.on('uniformupdated', () => this._emitColors('pick', null, false));
		ip.on('inputchange', () => this._emitColors('pickend', null, false));
		this.palettes[descriptor.name] = ip;

		this._currentPalette = ip;
	}

	_emitColors (eventName, x, y, updateHilight) {
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

		this._highlight.onResize();
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

	replaceElement (el) {
		el.insertAdjacentElement('beforebegin', this._canvas);
		domutils.remove(el);
		this.onResize();
	} 
}