const InputBase = require('./InputBase.js');

module.exports = class Slider extends InputBase 
{
  constructor (value, min, max, step, name) {
    super('range', { name: name, value: value, min: min, max: max, step: step });
    this._element.classList.add('iris-range');
    if (min < 0) 
    	this._input.classList.add('signed');
  }
}