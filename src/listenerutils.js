const domutils = require('./domutils.js');

// machine for simplifying mouse input.
const getMouseListenerObject = function (descriptor, event) {
	let button;
	switch(event.button) 
	{
		case 0: if (descriptor.left) button = descriptor.left; break; //left
		case 1: if (descriptor.right) button = descriptor.right; break; //right
		default: if (descriptor.any) button = descriptor.any; break; //other
	}

	if (event.altKey) return button.alt;
	else if (event.ctrlKey) return button.ctrl;
	else if (event.shiftKey) return button.shift;
	else if (button.default) return button.default;
	else return;
}

const createMouseListenerMachine = function (descriptor) {
	return function (e) {
		const on = getMouseListenerObject(descriptor, e);
		const down = on.down;
		const move = on.move;
		const up = on.up;
		const upContext = up ? up.context : window;
		
		const upFunction = function (ev) {
			if (up && up.handler) up.handler(ev);
			if (move && move.handler) 
				move.context.removeEventListener('mousemove', move.handler, false);
			upContext.removeEventListener('mouseup', upFunction, false);
		};

		if (down) down.handler(e);
		if (move) move.context.addEventListener('mousemove', move.handler, false);
		upContext.addEventListener('mouseup', upFunction, false);
	};
};


module.exports.mouse = function (downContext, descriptor) {
	var downFunction = createMouseListenerMachine(descriptor);
	downContext.addEventListener('mousedown', downFunction, false);
	return downFunction;
};

module.exports.simplePointer = (events) => {
	const down = events.down;
	const move = events.move;
	const up   = events.up;
	const downContext = down.context || window;
	const moveContext = move.context || window;
	const upContext = up.context || window;
	
	downContext.addEventListener('mousedown', e => {
		if (down && down.handler) down.handler(e);
		if (move && move.handler) moveContext.addEventListener('mousemove', move.handler, false);
	}, false);

	upContext.addEventListener('mouseup', e => {
		if (up   && up.handler)   up.handler(e);
		if (move && move.handler) moveContext.removeEventListener('mousemove', move.handler, false);
	}, false);
};

const POINTER_EVENTNAME = 'mouse';

function applyNormPos (e, rect) {
	e.relX  = Math.floor(e.clientX - rect.left);
	e.relY  = Math.floor(e.clientY - rect.top);
	e.normX = e.relX / rect.width * 2 - 1;
	e.normY = e.relY / rect.height * 2 - 1;
}
module.exports.normalPointer = (context, events) => {
	let rect;
	const moveCtx = events.contained ? context : window;
	const moveHandler = function (e) {
		applyNormPos(e, rect);
		events.move(e);
	};
	const upHandler = function (e) {
		if (events.up) {
			applyNormPos(e, rect);
			events.up(e);
		}
		if (events.move) moveCtx.removeEventListener(POINTER_EVENTNAME + 'move', moveHandler, false);
		window.removeEventListener(POINTER_EVENTNAME + 'up', upHandler, false);
	}

	context.addEventListener(POINTER_EVENTNAME + 'down', (e) => {
		rect = context.getBoundingClientRect();
		if (events.down) {
			applyNormPos(e, rect);
			events.down(e);
		}
		if (events.move) moveCtx.addEventListener(POINTER_EVENTNAME + 'move', moveHandler, false);
		window.addEventListener(POINTER_EVENTNAME + 'up', upHandler, false);
	}, false);
	
};