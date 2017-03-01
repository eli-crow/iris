const arrayutils = require('./arrayutils.js');
const mathutils = require('./mathutils.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js');

//todo: pull in  modernizr to test for existence.
const __baseSmoothing = 0.13;

const __defaults = {
  smmothedProps: [],
  minDistance: 2,
  steps: 5,
}

function __getPressure (evt) {
  const pressure = (listenerutils.eventName === 'pointer') ? evt.pressure :
    (listenerutils.eventName === 'touch') ? evt.targetTouches[0].force :
    0.5;
  return pressure;
};

class SmoothPointer
{ 
  constructor(context, options) {
    const _posBuffer = new Array(8);
    let _lastPressure;

    this.steps = options['steps'] || __defaults['steps'];
    this.minSquaredDistance = Math.pow(options['minDistance'] || __defaults['steps'], 2);
    this.smoothing = 0.5;
  
    if (fnutils.isFunction(options['down'])) this._onDown = options['down'];
    if (fnutils.isFunction(options['move'])) this._onMove = options['move'];
    if (fnutils.isFunction(options['up']))   this._onUp   = options['up'];

    let _squaredSpeed = 0;
    listenerutils.simplePointer(context, {
      contained: false,
      // preventDefault: true,
      // stopPropagation: true,

      down: e => {
        for (var i = 0; i < 4; i++) {
          _posBuffer[2*i]    = e.clientX;
          _posBuffer[2*i +1] = e.clientY;
        }
        _lastPressure = 0;
        this._onDown(e);
      },

      move: e => {
        const diffX = e.clientX - _posBuffer[0];
        const diffY = e.clientY - _posBuffer[1];
        const pressure = __getPressure(e);

        _squaredSpeed = Math.pow(diffX, 2) + Math.pow(diffY, 2);
        if (_squaredSpeed < this.minSquaredDistance) return;

        arrayutils.rotateArray(_posBuffer, 2);
        const smoothingDist = 1 - (__baseSmoothing + pressure * this.smoothing * (1 - __baseSmoothing));
        _posBuffer[0] += (e.clientX - _posBuffer[0]) * smoothingDist;
        _posBuffer[1] += (e.clientY - _posBuffer[1]) * smoothingDist;

        e.pts = mathutils.getLerpedCubicPoints(_posBuffer, 3, 2);
        e.squaredSpeed = _squaredSpeed;
        e.lastPressure = Math.max(_lastPressure * 1.2 - .2, 0);
        e.penPressure = Math.max(pressure * 1.2 - .2, 0);
        e.direction = Math.atan2(diffY, diffX) + Math.PI;
        
        _lastPressure = pressure;
        this._onMove(e);
      },

      up: e => this._onUp(e)
    })
  }
}

module.exports = SmoothPointer;