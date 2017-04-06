import Brush from './Brush.js';

export default class Eraser extends Brush
{
	constructor(options) {
		super(options, {
			size: {min: 0, max: 10, value: 4, map: x => x*x},
			flow: {min: 0, max: 1, value: 1}
		});

		this.erase = true;
	}
}