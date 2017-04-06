import Emitter from './Emitter.js';
import * as listenerutils from './listenerutils.js';

export default class Pupil extends Emitter
{
	constructor(canvas) {
		super(['huerotate', 'huerotateend', 'center']);

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
			move:        e => this.emit('huerotate', e),
			up:          e => this.emit('huerotateend', e),
			dblClick:    e => this.emit('center', e)
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