const domutils = require('./domutils.js');
const fnutils = require('./fnutils.js');
const arrayutils = require('./arrayutils.js');

//todo: currently nothing here is responsible for destroying own listeners. In future versions, this will be necessary.

//select the best available pointer event.
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

const __doubleClickTime = 300;

module.exports.simplePointer = (context, events, transform) => {
	let rect, button = 0, downX, downY;

	function fixupEvent(e, rect) {
		e = e || window.event;
		e.downButton = button;
		e.diffX = e.clientX - downX;
		e.diffY = e.clientY - downY;
		e.relX = Math.floor(e.clientX - rect.left);
		e.relY = Math.floor(e.clientY - rect.top);
		return e;
	}

	const xformIsFn = fnutils.isFunction(transform);
	const moveCtx = 
		events.moveEl ? events.moveEl : 
		events.contained ? context : window;

	let moveHandler;
	if (events.move) moveHandler = function (e) {
		e = fixupEvent(e, rect);
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (xformIsFn) transform(e, rect);
		events.move(e);
	};
	const upHandler = function (e) {
		e = fixupEvent(e, rect)
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
		rect = context.getBoundingClientRect();

		e = fixupEvent(e, rect);
		button = e.button;
		downX = e.clientX;
		downY = e.clientY;
		
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (events.down) {
			if (xformIsFn) transform(e, rect);
			events.down(e);
		}
		if (moveHandler) moveCtx.addEventListener(__events.move, moveHandler, false);
		window.addEventListener(__events.up, upHandler, false);
	}, false);

	if (events.dblClick) {
		let lastClickTime;

		const doubleClickHandler = function (e) {
			if (Date.now() - lastClickTime < __doubleClickTime) {
				events.dblClick(e);
			}
			lastClickTime = Date.now();
		}

		context.addEventListener('click', doubleClickHandler, false);
	}

	if (events.click) context.addEventListener('click', events.click, false);
};

module.exports.normalPointer = (context, events) => {
	module.exports.simplePointer(context, events, (e, rect) => {
		e.centerX       = e.relX - rect.width / 2;
		e.centerY       = e.relY - rect.height / 2;
		e.normX 	      = e.relX / rect.width * 2 - 1;
		e.normY 	      = e.relY / rect.height * 2 - 1;
		e.getAngle      = () => Math.atan2(e.centerX, e.centerY);
		e.getDistance   = () => Math.sqrt(Math.pow(e.centerY, 2) + Math.pow(e.centerX, 2));
	});
};


module.exports.mouseWheel = function (element, descriptor) { 
	const d = descriptor.debounce;
	let debounceHandler;
	if (d && fnutils.isFunction(d.handler)) {
		debounceHandler = fnutils.debounce(d.handler, d.wait, d.immediate);
	}

	const h = e => {
		e = e || window.event;
		e.delta = e.wheelDelta || -e.detail;
		descriptor.handler(e);
		if (debounceHandler) debounceHandler(e);
		if (descriptor.preventDefault) e.preventDefault();
	}

	if (element.addEventListener) {
		element.addEventListener("mousewheel", h, false);
		element.addEventListener("DOMMouseScroll", h, false);
	}
	else element.attachEvent("onmousewheel", h);
};

function listenOnce (element, eventname, fn, useCapture) {
	const handler = e => {
		fn(e);
		element.removeEventListener(eventname, handler, useCapture);
	}
	element.addEventListener(eventname, handler, useCapture);
};




const getKeyCodeArrayFromString = function (string) {
	const array = [];

	for (let i = 0, ii = string.length; i < ii; i++) {
		array.push(string.charCodeAt(i))
	}

	return array;
};

const parseKeyMappings = function (descriptor) {
	let keyMap = [];

	for (let keyString in descriptor) {
		switch(keyString) {
			//special strings
			case 'backspace': 
			case 'delete': keyMap.push([ [8], descriptor[keyString] ]); break;
			case 'space': keyMap.push([ [32], descriptor[keyString] ]); break;
			//anything else treated as array of keys
			default: keyMap.push( [
				getKeyCodeArrayFromString(keyString),
				descriptor[keyString]
			] ) 
			break;
		}
	}

	return keyMap;
}

const getKeyListenerObject = function (keyMap, keyCode) {
	for (let i = 0, ii = keyMap.length; i < ii; i++) {
		const keyBinding = keyMap[i];
		if (arrayutils.isAnyOf(keyCode, keyBinding[0])) {
			return keyBinding[1];
		}
	}

	return false;
};

/**
 * creates a listener configuration that, for each string key of the descriptor, fires a keypress event once and a key up when that key is released
 * @param  {object} descriptor an object that is structured like so: `{'abcd':{down: e => console.log('a, b, c, or d pressed'), up: down: e => console.log('a, b, c, or d released')}}`
 * @return {void}
 */
const createKeyboardListenerMachine = function (descriptor) {
	const keyUpListeners = {};
	let preventDefault;

	const keyMap = parseKeyMappings(descriptor);
	if (!keyMap.length) return false;

	return function (downEvent) {
		const downKeyCode = downEvent.keyCode || downEvent.which;
		if (preventDefault) downEvent.preventDefault();

		listenOnce(window, 'keypress', function (pressEvent) {
			const charKeyCode = pressEvent.charCode;
			const on = getKeyListenerObject(keyMap, charKeyCode);
			if (!on) return false;

			if (!fnutils.isFunction(keyUpListeners[downKeyCode])) {
				if (on.down) on.down(pressEvent);
				if (on.preventDefault) {
					preventDefault = true;
					pressEvent.preventDefault();
				}

				keyUpListeners[downKeyCode] = function (upEvent) {
					const upKeyCode = upEvent.keyCode || upEvent.which;
					if (keyUpListeners[upKeyCode]) {
						if (on.up) on.up(upEvent);
						window.removeEventListener('keyup', keyUpListeners[upKeyCode], false);
						delete keyUpListeners[upKeyCode];
					}
				};
				window.addEventListener('keyup', keyUpListeners[downKeyCode], false);
			}
		});
	};
};

module.exports.keyboard = function (descriptor) {
	return window.addEventListener('keydown', createKeyboardListenerMachine(descriptor), false);
};

module.exports.listenOnce = listenOnce;
module.exports.events = __events;
module.exports.eventName = __eventName;
module.exports.getKeyCodeArrayFromString = getKeyCodeArrayFromString;