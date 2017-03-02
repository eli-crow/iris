const domutils = require('./domutils.js');
const fnutils = require('./fnutils.js');

//currently nothing here is responsible for destroying own listeners. In future versions, this will be necessary.

let __eventName;
const __events = {}
if (Modernizr.hasEvent('pointermove')) {
	__eventName = 'pointer'
	__events.down = 'pointerdown';
	__events.move = 'pointermove';
	__events.up = 'pointerup';
}
else if (Modernizr.hasEvent('touchmove')) {
	__eventName = 'touch'
	__events.down = 'touchstart';
	__events.move = 'touchmove';
	__events.up = 'touchend';
}
else {
	__eventName = 'mouse'
	__events.down = 'mousedown';
	__events.move = 'mousemove';
	__events.up = 'mouseup';
}
console.log(__eventName);

module.exports.simplePointer = (context, events, transform) => {
	let rect;
	const xformIsFn = fnutils.isFunction(transform);
	const moveCtx = 
		events.moveEl ? events.moveEl : 
		events.contained ? context : window;

	let moveHandler;
	if (events.move) moveHandler = function (e) {
		e = e || window.event;
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (xformIsFn) transform(e, rect);
		events.move(e);
	};
	const upHandler = function (e) {
		e = e || window.event;
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (events.up) {
			if (xformIsFn) transform(e, rect);
			events.up(e);
		}
		if (moveHandler) moveCtx.removeEventListener(__events.move, moveHandler, false);
		window.removeEventListener(__events.up, upHandler, false);
	};

	context.addEventListener(__events.down, (e) => {
		e = e || window.event;
		
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		rect = context.getBoundingClientRect();
		if (events.down) {
			if (xformIsFn) transform(e, rect);
			events.down(e);
		}
		if (moveHandler) moveCtx.addEventListener(__events.move, moveHandler, false);
		window.addEventListener(__events.up, upHandler, false);
	}, false);

	if (events.click) context.addEventListener('click', events.click, false);
}

module.exports.mouseWheel = function (element, handler) { 
	const h = e => {
		e = e || window.event;
		e.delta = e.wheelDelta || -e.detail;
		handler(e);
	}

	if (element.addEventListener) {
		element.addEventListener("mousewheel", h, false);
		element.addEventListener("DOMMouseScroll", h, false);
	}
	else element.attachEvent("onmousewheel", h);
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

module.exports.events = __events;
module.exports.eventName = __eventName;