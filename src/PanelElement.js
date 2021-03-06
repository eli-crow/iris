import Emitter from './Emitter.js';
import * as fnutils from './fnutils.js';
import * as domutils from './domutils.js';

//abstraction layer for managing and manipulating the dom in panels.
export default class PanelElement extends Emitter
{
	constructor (events, element) {
		super(events);
		this._element = __processElement(element);

		//init
		this.class('iris-panel-element');
	}

	appendTo (element) {
		element.appendChild(this._element);
		return this;
	}

	appendHTML (html, position) {
		position = position || 'beforeend';
		this._element.insertAdjacentHTML(position, html);
	}

	remove() {
		if (this._element.parentNode)
			this._element.parentNode.removeChild(this._element);
		return this;
	}

	classes (names) {
		if (names === null) return this;
		for (let i = 0, ii = arguments.length; i < ii; i++) {
			this._element.classList.add(arguments[i]);
		}
		return this;
	}

	class (names) {
		return this.classes(names);
	}

	unclass() {
		for (let i = 0, ii = arguments.length; i < ii; i++) {
			this._element.classList.remove(arguments[i]);
		}
		return this;
	}

	transform (transform) {
		domutils.setVendorCss(this._element, 'transform', transform);

		return this;
	}

	hide() {
		this._element.style.display = 'none';
		return this;
	}

	unhide() {
		this._element.style.display = '';
		return this;
	} 
}


//private methods
function __processElement (element) {
	if (typeof element == 'string') {
		const temp = document.createElement('div');
		temp.insertAdjacentHTML('beforeend', element);
		return temp;
	} 

	else if (element instanceof HTMLElement) {
		return element;
	}

	else {
		return document.createElement('div');
	}
}