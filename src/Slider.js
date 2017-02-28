const InputBase = require('./InputBase.js');

module.exports = class Slider extends InputBase 
{
  constructor (value, min, max, step, name) {
    super('range', { name: name, value: value, min: min, max: max, step: step });
    if (min < 0) 
    	this._input.classList.add('signed');
  }
}