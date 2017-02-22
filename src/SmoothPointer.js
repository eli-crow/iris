const Reactor = require('./Reactor.js');
const arrayutils = require('./arrayutils.js');
const mathutils = require('./mathutils.js');
const fnutils = require('./fnutils.js');
const listenerutils = require('./listenerutils.js');

//todo: pull in  modernizr to test for existence.
const POINTER_EVENTNAME = 'pointer';

class SmoothPointer
{ 
  constructor(context, options) {
    var _nBufferComponents = 2;
    this._steps = options['steps'] || 5;
    this._minSquaredDistance = Math.pow(options['minDistance'], 2) || 400;
    this._interpolatedPts = new Array(_nBufferComponents * this._steps);
    this._smoothing = 0.3;
    this._squaredSpeed = 0;

    const _buffer = new Array(8);
  
    const _reactor = new Reactor(['down', 'move', 'up']);
    this.on  = _reactor.addEventListener.bind(_reactor);
    this.off = _reactor.removeEventListener.bind(_reactor);
  
    if (fnutils.isFunction(options['down'])) this.on('down', options['down']);
    if (fnutils.isFunction(options['move'])) this.on('move', options['move']);
    if (fnutils.isFunction(options['up']))   this.on('up',   options['up']);

    listenerutils.simplePointer(context, {
      contained: false,
      preventDefault: true,
      stopPropagation: true,

      down: e => {
        _buffer[0] = _buffer[2] = _buffer[4] = _buffer[6] = e.clientX;
        _buffer[1] = _buffer[3] = _buffer[5] = _buffer[7] = e.clientY;
        
        _reactor.dispatchEvent('down', e);
      },

      move: e => {
        this._squaredSpeed = Math.abs(
            Math.pow(e.clientX - _buffer[0], 2) 
          + Math.pow(e.clientY - _buffer[1], 2) 
        );
        if (this._squaredSpeed < this._minSquaredDistance) return;

        arrayutils.rotateArray(_buffer, _nBufferComponents);
        var diffx = e.clientX - _buffer[0];
        var diffy = e.clientY - _buffer[1];
        _buffer[0] += diffx * (1 - this._smoothing);
        _buffer[1] += diffy * (1 - this._smoothing);
        
        _reactor.dispatchEvent('move', {
          pts: mathutils.getCubicPoints(_buffer, this._steps, _nBufferComponents, this._interpolatedPts),
          squaredSpeed: this._squaredSpeed,
          pressure: e.pressure || 0,
          direction: Math.atan2(diffy, diffx) + Math.PI
        });
      },
      
      up: e => _reactor.dispatchEvent('up', e)
    })
  }
}

module.exports = SmoothPointer;