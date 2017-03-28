const Emitter = require('./Emitter.js');
const SmoothPointer = require('./SmoothPointer.js');
const listenerutils = require('./listenerutils.js');
const ResizeListener = require('./ResizeListener.js');

//enum
const PointerStates = {
	Brush:  0,
	Pan:    1,
	Sample: 2,
	Erase:  3,
	Move:   4
};

// interface PointerStateEvent {
// 	preventDefault : Function,
// 	state : PointerState
// }

// interface IrisPointerEvent {
//  preventDefault : Function,
//  surface : Surface,
//  relX : number,
//  relY : number,
//  etc...
// }

//manages input state for application. emits effective action and returns to actual tool selection. also manages cursor style;
module.exports = class InputManager extends Emitter
{
	constructor (relativeElmnt) {
		super([
			'pointerstatechange',
			'pointerdown',
			'pointermove',
			'pointerup',

			'clear',
			'undo',

			'zoom'
		]);

		this.pointerState = PointerStates.Brush;
		this.pointer = new SmoothPointer(document.documentElement, {
			minDistance: 2,
			steps: 2,
			smoothing: 0.5,
			relativeTo: relativeElmnt,

			down: e => this.emit('pointerdown', e),
			move: e => this.emit('pointermove', e),
			up:   e => this.emit('pointerup', e)
		});

		listenerutils.keyboard({
			//========================================================= PointerStates
			'space': {
				preventDefault: true,
				down: e => this.emitPointerStateEvent(e, PointerStates.Pan),
				up:   e => this.revertPointerState(e)
			},
			'alt': {
				preventDefault: true,
				down: e => this.emitPointerStateEvent(e, PointerStates.Sample),
				up:   e => this.revertPointerState(e)
			},
			'meta': {
				preventDefault: true,
				down: e => this.emitPointerStateEvent(e, PointerStates.Move),
				up:   e => this.revertPointerState(e)
			},


			//========================================================= Tool Shortcuts
			'e':  { //eraser
				preventDefault: true,
				down: e => this.setPointerState(e, PointerStates.Erase)
			},
			'b':  { //brush
				preventDefault: true,
				down: e => this.setPointerState(e, PointerStates.Brush)
			},


			//========================================================= Commands
			'meta + z': {
				preventDefault: true,
				down: e => this.emit('undo')
			},
			'backspace': {
				preventDefault: true,
				down: e => this.emit('clear')
			}
		});

		this.resize = new ResizeListener({
			after: e => setPointerScale(e.zoom)
		});

		window.addEventListener('focus', e => this.revertPointerState(e));
	}

	emitPointerStateEvent (e, state) {
		this.emit('pointerstatechange', {
			preventDefault: () => e.preventDefault.call(e),
			state: state
		});
	}

	setPointerState (e, state) {
		this.emitPointerStateEvent(e, state);
		this.pointerState = state;
	}

	revertPointerState(e) {
		this.emitPointerStateEvent(e, this.pointerState);
	}

	setPointerScale (zoom) {
		console.log(zoom);
		// const scale = this.pointer.scale + change/10;
		// this.pointer.scale = scale;
		// this.emit('zoom', scale);
		// this.scale += change/10;
		// this.emit('zoom', this.scale);
	}
};

module.exports.PointerStates = PointerStates;