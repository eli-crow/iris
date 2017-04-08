import Emitter from './Emitter.js';
import SmoothPointer from './SmoothPointer.js';
import ResizeListener from './ResizeListener.js';
import * as listenerutils from './listenerutils.js';

//todo: replace 'move' with drag
//PubSub events

//enum
export const PointerStates = {
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
// 

//manages input state for application.
export default class InputManager
{
	constructor (relativeElmnt) {
		this.pointerState = PointerStates.Brush;
		this.pointer = new SmoothPointer(document.querySelector('main'), {
			minDistance: 2,
			steps: 2,
			smoothing: 0.5,
			relativeTo: relativeElmnt,

			down: e => PubSub.publish(Events.Input.PointerDown, e),
			move: e => PubSub.publish(Events.Input.PointerDrag, e),
			up:   e => PubSub.publish(Events.Input.PointerUp, e)
		});

		listenerutils.keyboard({
			//========================================================= PointerStates
			'space': {
				preventDefault: true,
				down: e => this.publishPointerStateEvent(e, PointerStates.Pan),
				up:   e => this.revertPointerState(e)
			},
			'alt': {
				preventDefault: true,
				down: e => this.publishPointerStateEvent(e, PointerStates.Sample),
				up:   e => this.revertPointerState(e)
			},
			'meta': {
				preventDefault: true,
				down: e => this.publishPointerStateEvent(e, PointerStates.Move),
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
				down: e => PubSub.publish(Events.Input.Undo)
			},
			'backspace': {
				preventDefault: true,
				down: e => PubSub.publish(Events.Input.Clear)
			}
		});

		this.resize = new ResizeListener({
			after: e => setPointerScale(e.zoom)
		});

		window.addEventListener('focus', e => this.revertPointerState(e));
	}

	publishPointerStateEvent (e, state) {
		PubSub.publish(Events.Input.PointerStateChange, {
			preventDefault: () => e.preventDefault.call(e),
			state: state
		})
	}

	setPointerState (e, state) {
		this.publishPointerStateEvent(e, state);
		this.pointerState = state;
	}

	revertPointerState(e) {
		this.publishPointerStateEvent(e, this.pointerState);
	}
};