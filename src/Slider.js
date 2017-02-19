const InputBase = require('./InputBase.js');

class Slider extends InputBase 
{
  constructor (value, min, max, step = 1) {
    super('range', {
    	value: value,
    	min: min,
    	max: max,
    	step: step
    });
  }
}

module.exports = Slider;