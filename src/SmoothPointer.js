const Reactor = require('./Reactor.js');
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

    const _reactor = new Reactor(['down', 'move', 'up']);
    this.on  = _reactor.addEventListener.bind(_reactor);
    this.off = _reactor.removeEventListener.bind(_reactor);
  
    if (fnutils.isFunction(options['down'])) this.on('down', options['down']);
    if (fnutils.isFunction(options['move'])) this.on('move', options['move']);
    if (fnutils.isFunction(options['up']))   this.on('up',   options['up']);

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
        _reactor.dispatchEvent('down', e);
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

        const steps = Math.floor(mathutils.clamp(_squaredSpeed / 80, 4, this.steps));    

        _reactor.dispatchEvent('move', {
          nComponents: nComponents,
          pts: mathutils.getCubicPoints(_buffer, steps, nComponents, this._interpolatedPts),
          squaredSpeed: _squaredSpeed,
          pressure: e.pressure || 1,
          direction: Math.atan2(diffY, diffX) + Math.PI
        });
      },

      up: e => _reactor.dispatchEvent('up', e)
    })
  }
}

module.exports = SmoothPointer;