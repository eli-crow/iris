const InputBase = require('./InputBase.js');

module.exports = class Slider extends InputBase 
{
  constructor (value, min, max, step, name) {
    super('range', { name, value, min, max, step });

    //init
    this.class('iris-range');
    if (min < 0) this.class('signed');
  }
}