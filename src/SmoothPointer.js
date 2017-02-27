const arrayutils = require('./arrayutils.js');
const mathutils = require('./mathutils.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js');

//todo: pull in  modernizr to test for existence.
const POINTER_EVENTNAME = 'pointer';
const BASE_SMOOTHING = 0.2;

const __defaults = {
  smmothedProps: [],
  minDistance: 2,
  steps: 5,
}

class SmoothPointer
{ 
  constructor(context, options) {
    const _posBuffer = new Array(8);

    this.steps = options['steps'] || __defaults['steps'];
    this.minSquaredDistance = Math.pow(options['minDistance'] || __defaults['steps'], 2);
    this.smoothing = 0.3;
  
    if (fnutils.isFunction(options['down'])) this._onDown = options['down'];
    if (fnutils.isFunction(options['move'])) this._onMove = options['move'];
    if (fnutils.isFunction(options['up']))   this._onUp   = options['up'];

    let _squaredSpeed = 0;
    listenerutils.simplePointer(context, {
      contained: false,
      preventDefault: true,
      stopPropagation: true,

      down: e => {
        for (var i = 0; i < 4; i++) {
          _posBuffer[2*i]    = e.clientX;
          _posBuffer[2*i +1] = e.clientY;
        }
        this._onDown(e);
      },

      move: e => {
        const diffX = e.clientX - _posBuffer[0];
        const diffY = e.clientY - _posBuffer[1];

        _squaredSpeed = Math.pow(diffX, 2) + Math.pow(diffY, 2);
        if (_squaredSpeed < this.minSquaredDistance) return;

        const smoothingDist = 1 - (BASE_SMOOTHING + e.pressure * this.smoothing * (1 - BASE_SMOOTHING));

        arrayutils.rotateArray(_posBuffer, 2);
        _posBuffer[0] += (e.clientX - _posBuffer[0]) * smoothingDist;
        _posBuffer[1] += (e.clientY - _posBuffer[1]) * smoothingDist;

        e.pts = mathutils.getLinearInterpolatedCubicPoints(_posBuffer, 3, 2);
        e.squaredSpeed = _squaredSpeed;
        e.penPressure = (e.pressure * 1.2 - .2) || 1;
        e.direction = Math.atan2(diffY, diffX) + Math.PI;
        
        this._onMove(e);
      },

      up: e => this._onUp(e)
    })
  }
}

module.exports = SmoothPointer;