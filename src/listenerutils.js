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

function getContextRect (context) {
	const rect = context.getBoundingClientRect();
	return {
		x: rect.left + rect.width/2,
		y: rect.top + rect.height/2,
		width: rect.width,
		height: rect.height
	};
}
function applyNormPos (e, rect) {
	e.normX = (e.clientX - rect.x) / rect.width * 2;
	e.normY = (e.clientY - rect.y) / rect.height * 2;
}
module.exports.normalPointer = (context, events) => {
	let rect;
	const moveHandler = function (e) {
		applyNormPos(e, rect);
		events.move(e);
	};

	context.addEventListener('mousedown', (e) => {
		rect = getContextRect(context);
		if (events.down) {
			applyNormPos(e, rect);
			events.down(e);
		}
		if (events.move) window.addEventListener('mousemove', moveHandler, false);
	}, false);

	window.addEventListener('mouseup', (e) => {
		if (events.up) {
			applyNormPos(e, rect);
			events.up(e);
		}
		if (events.move) window.removeEventListener('mousemove', moveHandler, false);
	}, false);
};