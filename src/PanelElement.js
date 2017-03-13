const Emitter = require('./Emitter.js');

//abstraction layer for managing and manipulating the dom in panels.
module.exports = class PanelElement extends Emitter
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
		this._element.parentNode.removeChild(this._element);
		return this;
	}

	classes (names) {
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
		this.transform = transform;
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