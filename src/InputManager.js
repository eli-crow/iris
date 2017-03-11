const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');

const PointerStates = {
	Brush: 0,
	Pan: 1,
	Sample: 2
};

// interface PointerStateEvent {
// 	preventDefault : Function;
// 	state : PointerState;
// }

//manages input state for application. emits effective action and returns to actual tool selection.
module.exports = class InputManager extends Emitter
{
	constructor() {
		super([
			'pointerstatechange', 
			'undo'
		]);

		this.pointerState = PointerStates.Brush;

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

			//commands
			'z': {
				preventDefault: true,
				down: e => this.emit('undo')
			}
		});
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