const Emitter = require('./Emitter.js');

module.exports = class PanelElement extends Emitter
{
	constructor (events) {
		super(events);
		this._element = null;
	}

	appendTo (element) {
		element.appendChild(this._element);
		return this;
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