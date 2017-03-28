const InputBase = require('./InputBase.js');
const objutils = require('./objutils.js');

const __template = require('../templates/input-slider.pug');

module.exports = class Slider extends InputBase 
{
  constructor (value, min, max, step, name, options) {
    super('range', null , null, __template({ 
    	value, min, max, step, 
    	icon: options ? options['icon'] : null,
    	name: name
    }));

    //init
    this.class('iris-range');
    if (min < 0) this.class('signed');
  }
}