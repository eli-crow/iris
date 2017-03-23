const Brush = require('./Brush.js');

module.exports = class Eraser extends Brush
{
	constructor(options) {
		super(options, {
			flow: {min: 0, max: 1, value: 1}
		});

		this.erase = true;
	}
}