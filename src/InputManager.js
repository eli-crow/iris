const Emitter = require('./Emitter.js');
const SmoothPointer = require('./SmoothPointer.js');
const listenerutils = require('./listenerutils.js');

//enum
const PointerStates = {
	Brush:  0,
	Pan:    1,
	Sample: 2,
	Move: 3
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

//manages input state for application. emits effective action and returns to actual tool selection.
module.exports = class InputManager extends Emitter
{
	constructor (relativeElmnt) {
		super([
			'pointerstatechange',
			'pointerdown',
			'pointermove',
			'pointerup'
		]);

		this.pointerState = PointerStates.Brush;
		this.pointer = new SmoothPointer(document.documentElement, {
			minDistance: 4,
			steps: 2,
			smoothing: 0.5,
			relativeTo: relativeElmnt,

			down: e => this.emit('pointerdown', e),
			move: e => this.emit('pointermove', e),
			up:   e => this.emit('pointerup', e)
		});

		listenerutils.keyboard({
			//pointer states
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

			//commands
			'z': {
				preventDefault: true,
				down: e => this.emit('undo')
			}
		});
	}

	emitIrisPointerEvent (e) {
		
	}

	emitPointerStateEvent (e, state) {
		this.emit('pointerstatechange', {
			preventDefault: () => e.preventDefault.call(e),
			state: state
		});
	}

	setPointerState (e, state) {
		emitPointerStateEvent(e, state);
		this.state = state;
	}

	revertPointerState(e) {
		this.emitPointerStateEvent(e, this.pointerState);
	}
};

module.exports.PointerStates = PointerStates;