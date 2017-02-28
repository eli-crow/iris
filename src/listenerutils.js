const domutils = require('./domutils.js');
const fnutils = require('./fnutils.js');

const POINTER_EVENTNAME = Modernizr.testProp('pointerEvents') ? 'pointer' : 'mouse';

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

	if (events.click) context.addEventListener('click', events.click, false);
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