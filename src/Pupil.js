const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');

const PUPIL_RADIUS = 0.25

module.exports = class Pupil extends Emitter
{
	constructor(canvas) {
		super(['drag', 'release', 'click']);

		const element = document.createElement('div');
		element.classList.add('iris-pupil');
		canvas.insertAdjacentElement('afterend', element);

		this._canvas = canvas;
		this._element = element;

		listenerutils.normalPointer(element, {
			contained: false,
			move:  e => this.emit('drag',    e),
			up:    e => this.emit('release', e),
			click: e => this.emit('click',   e)
		});
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