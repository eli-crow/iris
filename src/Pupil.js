const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');

module.exports = class Pupil extends Emitter
{
	constructor(canvas) {
		super(['drag', 'release', 'click']);

		this._canvas = canvas;
		this._element = null;

		this.init();
	}

	init() {
		const element = document.createElement('div');
		element.classList.add('iris-pupil');
		this._canvas.insertAdjacentElement('afterend', element);
		this._element = element;

		listenerutils.normalPointer(element, {
			contained: true,
			moveEl: this._canvas,

			down:  e => this.onDown(e),
			move:  e => this.onDrag(e),
			up:    e => this.onUp(e),
			click: e => this.onClick(e)
		});
	}

	onDown (e) {
		this._isDragging = false;
	}

	onDrag (e) {
		this._isDragging = true;
		this.emit('drag', e);
	}

	onUp (e) {
		this.emit('release', e);
	}

	onClick (e) {
		if (!this._isDragging) 
			this.emit('click', e);
	}

	resize () {
		const canvas = this._canvas;
		const width = canvas.width;
		const height = canvas.height;
		const ps  = this._element.style;
		const pw  = PUPIL_RADIUS * width;
		const ph  = PUPIL_RADIUS * height;
		ps.left   = (width/2 + canvas.offsetLeft - pw/2) + 'px';
		ps.top    = (height/2 + canvas.offsetTop - ph/2) + 'px';
		ps.width  = pw + 'px';
		ps.height = ph + 'px';
	}
}