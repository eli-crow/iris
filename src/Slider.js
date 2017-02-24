const InputBase = require('./InputBase.js');

class Slider extends InputBase 
{
  constructor (value, min, max, step = 1) {
    super('range', { value: value, min: min, max: max, step: step });
    if (min < 0) {
    	this._element.classList.add('signed');
    }
  }
}

module.exports = Slider;