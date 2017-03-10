const Emitter = require('./Emitter.js');
const listenerutils = require('./listenerutils.js');

//manages input state for application.
module.exports = class InputManager extends Emitter
{
	constructor() {
		super([
			'panstart', 'panend'
		]);

		listenerutils.keyboard({
			'space': {
				preventDefault: true,
				down: e => this.emit('panstart'),
				up: e => this.emit('panend')
			}
		});
	}
};