const InputBase = require('./InputBase.js');

class Slider extends InputBase 
{
  constructor (min, max, step = 1) {
    super('range', {
    	min: min,
    	max: max,
    	step: step
    });
  }
}

module.exports = Slider;