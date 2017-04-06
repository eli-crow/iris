import Emitter from './Emitter.js';
import * as listenerutils from './listenerutils.js';

export default class Pupil extends Emitter
{
	constructor(canvas) {
		super(['huerotate', 'huerotateend', 'center']);

		this._canvas = canvas;
		this._element = document.createElement('div');

		//init
		this._element.classList.add('iris-pupil');

		listenerutils.normalPointer(this._element, {
			move:        e => this.emit('huerotate', e),
			up:          e => this.emit('huerotateend', e),
			dblClick:    e => this.emit('center', e)
		});
	}

	resize () {
		this._canvas.insertAdjacentElement('afterend', this._element);
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