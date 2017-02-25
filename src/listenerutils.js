const domutils = require('./domutils.js');
const fnutils = require('./fnutils.js');

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


const POINTER_EVENTNAME = 'pointer';


module.exports.simplePointer = (context, events, transform) => {
	let rect;
	const xformIsFn = fnutils.isFunction(transform);
	const moveCtx = events.contained ? context : window;

	let moveHandler;
	if (events.move) moveHandler = function (e) {
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (xformIsFn) transform(e, rect);
		events.move(e);
	};
	const upHandler = function (e) {
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (events.up) {
			if (xformIsFn) transform(e, rect);
			events.up(e);
		}
		if (moveHandler) moveCtx.removeEventListener(POINTER_EVENTNAME + 'move', moveHandler, false);
		window.removeEventListener(POINTER_EVENTNAME + 'up', upHandler, false);
	};

	context.addEventListener(POINTER_EVENTNAME + 'down', (e) => {
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		rect = context.getBoundingClientRect();
		if (events.down) {
			if (xformIsFn) transform(e, rect);
			events.down(e);
		}
		if (moveHandler) moveCtx.addEventListener(POINTER_EVENTNAME + 'move', moveHandler, false);
		window.addEventListener(POINTER_EVENTNAME + 'up', upHandler, false);
	}, false);
}

module.exports.normalPointer = (context, events) => {
	module.exports.simplePointer(context, events, (e, rect) => {
		e.relX  	      = Math.floor(e.clientX - rect.left);
		e.relY  	      = Math.floor(e.clientY - rect.top);
		e.centerX       = e.relX - rect.width / 2;
		e.centerY       = e.relY - rect.height / 2;
		e.normX 	      = e.relX / rect.width * 2 - 1;
		e.normY 	      = e.relY / rect.height * 2 - 1;
		e.getAngle      = () => Math.atan2(e.centerX, e.centerY);
		e.getDistance   = () => Math.sqrt(Math.pow(e.centerY, 2) + Math.pow(e.centerX, 2));
	});
}