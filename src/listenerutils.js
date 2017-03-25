const domutils = require('./domutils.js');
const fnutils = require('./fnutils.js');
const arrayutils = require('./arrayutils.js');
const strutils = require('./strutils.js');

//todo: currently nothing here is responsible for destroying own listeners. In future versions, this will be necessary.

//select the best available pointer event.
let __eventName;
const __events = {}
if (Modernizr.hasEvent('pointermove')) {
	__eventName = 'pointer'
	__events.down = 'pointerdown';
	__events.move = 'pointermove';
	__events.up = 'pointerup';
	__events.enter = 'pointerenter';
	__events.exit = 'pointerleave';
}
else if (Modernizr.hasEvent('touchmove')) {
	__eventName = 'touch'
	__events.down = 'touchstart';
	__events.move = 'touchmove';
	__events.up = 'touchend';
	__events.enter = 'touchenter';
	__events.exit = 'touchleave';
}
else {
	__eventName = 'mouse'
	__events.down = 'mousedown';
	__events.move = 'mousemove';
	__events.up = 'mouseup';
	__events.enter = 'mouseenter';
	__events.exit = 'mouseleave';
}

const __doubleClickTime = 300;

function doubleClick (fn, delay) {
	let then;
	delay = delay || __doubleClickTime;

	return function (e) {
		if (Date.now() - then < delay) {
			fn(e);
		}

		then = Date.now();
	}
};


module.exports.simplePointer = (context, events, transform) => {
	let rect, button = 0, downX, downY;

	const xformIsFn = fnutils.isFunction(transform);
	const moveCtx = events['moveEl'] || (events['contained']) ? context : window;
	const relativeTo = events['relativeTo'] || context;

	function fixupSimplePointerEvent(e, rect) {
		e = e || window.event;
		e.downButton = button;
		e.diffX = e.clientX - downX;
		e.diffY = e.clientY - downY;
		e.relX = Math.floor(e.clientX - rect.left);
		e.relY = Math.floor(e.clientY - rect.top);
		return e;
	}

	let moveHandler;
	if (events.move) moveHandler = function (e) {
		e = fixupSimplePointerEvent(e, rect);
		if (events.preventDefault) e.preventDefault();
		if (events.stopPropagation) e.stopPropagation();
		if (xformIsFn) transform(e, rect);
		events.move(e);
	};
	const upHandler = function (e) {
		e = fixupSimplePointerEvent(e, rect)
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
		rect = relativeTo.getBoundingClientRect();

		e = fixupSimplePointerEvent(e, rect);
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

	if (fnutils.isFunction(events.enter))    
		context.addEventListener(__events['enter'], events.enter, false);
	if (fnutils.isFunction(events.exit))     
		context.addEventListener(__events['exit'], events.exit, false);
	if (fnutils.isFunction(events.click))    
		context.addEventListener('click', events.click, false);
	if (fnutils.isFunction(events.dblClick)) 
		context.addEventListener('click', doubleClick(events.dblClick), false);
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



const parseKeyMappings = function (descriptor) {
	let keyMap = [];

	for (let name in descriptor) {
		const tokens = name.match(/([^\s\+]+)/g);
		const keyMapObject = {};
		let keyString;

		keyMapObject.on = descriptor[name];

		const nTokens = tokens.length;
		if (nTokens > 1) {
			const last = tokens.length - 1;
			keyString = tokens[last];
			const modifiers = tokens.slice(0, last)

			for (var i = 0, ii = modifiers.length; i < ii; i++) 
				modifiers[i] = strutils.titleCase(modifiers[i]);

			keyMapObject.on.modifiers = modifiers;
		} 
		else {
			keyString = tokens[0];
		}

		let KS = strutils.titleCase(keyString);
		switch(KS) {
			//reserved for KeyboardEvent.Key types
			//TODO: fill this out.
			case 'Backspace': case 'Delete':    case 'Alt':       case 'Tab':
			case 'Enter':     case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight': 
			case 'ArrowUp':   case 'End':       case 'Home':      case 'PageDown':
			case 'Clear':     case 'Copy':      case 'CrSel':     case 'Cut':     
			case 'ExSel':     case 'Insert':    case 'Paste':     case 'Redo':
			case 'PageUp':    case 'EraseEof':  case 'Undo':      case 'Meta':
				keyMapObject.keys = [ KS ]
			break;

			//special strings
			case 'Space': case 'Spacebar':
				keyMapObject.keys = [' '];
			break;

			//anything else treated as array of keys
			default: 
				keyMapObject.keys = keyString.split('');
			break;
		}

		// console.log(keyMapObject.on);

		keyMap.push(keyMapObject);
	}

	// console.log(keyMap);
	return keyMap;
}

//todo: safari does not support KeyboardEvent.key, detect this, and adjust to keypress or some other method
const getKeyListenerObject = function (keyMap, downEvent) {
	for (let i = 0, ii = keyMap.length; i < ii; i++) {
		if (arrayutils.isAnyOf(downEvent.key, keyMap[i].keys)) return keyMap[i].on;
	}
};

const checkAllModifiersMet = function (event, modifiers) {
	if (!Array.isArray(modifiers)) return true;
	for (var i = 0, ii = modifiers.length; i < ii; i++) {
		if (!event.getModifierState(modifiers[i])) {
			return false;
		}
	}
	return true;
};

/**
 * creates a listener configuration that, for each string key of the descriptor, fires a keydown event once and a key up when that key is released
 * @param  {object} descriptor an object that is structured like so: `{'abcd':{down: e => console.log('a, b, c, or d pressed'), up: down: e => console.log('a, b, c, or d released')}}`
 * @return {void}
 */
const createKeyboardListenerMachine = function (descriptor) {
	const keyUpListeners = {};
	const keyMap = parseKeyMappings(descriptor);
	if (!keyMap.length) return false;

	return function (downEvent) {
		const downKeyCode = downEvent.keyCode || downEvent.which;
		const on = getKeyListenerObject(keyMap, downEvent);		

		if (!on) return false;
		if (fnutils.isFunction(keyUpListeners[downKeyCode])) return false;
		if (!checkAllModifiersMet(downEvent, on.modifiers)) return false;

		// all good
		if (on.down) on.down(downEvent);
		keyUpListeners[downKeyCode] = function (upEvent) {
			const upKeyCode = upEvent.keyCode || upEvent.which;
			if (keyUpListeners[upKeyCode]) {
				if (on.up) on.up(upEvent);
				window.removeEventListener('keyup', keyUpListeners[upKeyCode], false);
				delete keyUpListeners[upKeyCode];
			}
		};
		window.addEventListener('keyup', keyUpListeners[downKeyCode], false);

		if (on.preventDefault) downEvent.preventDefault();
		if (on.stopPropagation) downEvent.stopPropagation();
	};
};

module.exports.keyboard = function (descriptor) {
	return window.addEventListener('keydown', createKeyboardListenerMachine(descriptor), false);
};

module.exports.doubleClick = doubleClick;
module.exports.listenOnce = listenOnce;
module.exports.events = __events;
module.exports.eventName = __eventName;