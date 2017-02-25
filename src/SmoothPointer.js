const arrayutils = require('./arrayutils.js');
const mathutils = require('./mathutils.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js');

//todo: pull in  modernizr to test for existence.
const POINTER_EVENTNAME = 'pointer';

const __defaults = {
  smmothedProps: [],
  minDistance: 2,
  steps: 5,
}

class SmoothPointer
{ 
  constructor(context, options) {
    const smoothedProps = ['clientX', 'clientY'].concat(options['smoothedProps'] || __defaults['smoothedProps']);
    const nComponents = smoothedProps.length;
    const _buffer = new Array(4 * nComponents);

    this.steps = options['steps'] || __defaults['steps'];
    this.minSquaredDistance = Math.pow(options['minDistance'] || __defaults['steps'], 2);
    this.smoothing = 0.3;

    this._interpolatedPts = new Array(nComponents * this.steps);
  
    if (fnutils.isFunction(options['down'])) this._onDown = options['down'];
    if (fnutils.isFunction(options['move'])) this._onMove = options['move'];
    if (fnutils.isFunction(options['up']))   this._onUp   = options['up'];

    let _squaredSpeed = 0;
    listenerutils.simplePointer(context, {
      contained: false,
      preventDefault: true,
      stopPropagation: true,

      down: e => {
        for (let i = 0, ii = nComponents; i < ii; ++i) {
          const prop = e[smoothedProps[i]];
          _buffer[i + ii * 0] = prop;
          _buffer[i + ii * 1] = prop;
          _buffer[i + ii * 2] = prop;
          _buffer[i + ii * 3] = prop;
        }
        this._onDown(e);
      },

      move: e => {
        let diffX = e.clientX - _buffer[0];
        let diffY = e.clientY - _buffer[1];
        _squaredSpeed = Math.abs(
            Math.pow(diffX, 2) 
          + Math.pow(diffY, 2) 
        );
        if (_squaredSpeed < this.minSquaredDistance) return;

        arrayutils.rotateArray(_buffer, nComponents);
        for (let i = 0, ii = nComponents; i < ii; ++i) {
          const prop = e[smoothedProps[i]];
          var diff = prop - _buffer[i];
          _buffer[i] += diff * (1 - this.smoothing);
        }

        this._onMove({
          nComponents: nComponents,
          pts: mathutils.getCubicPoints(_buffer, this.steps, nComponents, this._interpolatedPts),
          squaredSpeed: _squaredSpeed,
          pressure: (e.pressure * 1.2 - .2) || 1,
          direction: Math.atan2(diffY, diffX) + Math.PI
        });
      },

      up: e => this._onUp(e)
    })
  }
}

module.exports = SmoothPointer;